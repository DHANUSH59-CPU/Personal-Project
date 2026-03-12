import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiShield, FiTag, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetCartQuery } from '../api/cartApi';
import { useCreateOrderMutation, useInitiatePaymentMutation, useVerifyPaymentMutation } from '../api/orderApi';
import styles from '../styles/pages/Checkout.module.css';

// ── Load Razorpay SDK ────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const INITIAL_ADDRESS = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [initiatePayment] = useInitiatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const cart = cartData?.data;
  const items = (cart?.items || []).filter((item) => item.product?.isActive);

  // ── Calculations ──────────────────────────
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity,
    0
  );
  const savings = mrpTotal - subtotal;
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // ── Validation ────────────────────────────
  const validate = () => {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = 'Required';
    if (!address.phone.trim()) errs.phone = 'Required';
    else if (!/^\d{10}$/.test(address.phone.trim())) errs.phone = 'Enter 10-digit number';
    if (!address.line1.trim()) errs.line1 = 'Required';
    if (!address.city.trim()) errs.city = 'Required';
    if (!address.state.trim()) errs.state = 'Required';
    if (!address.pincode.trim()) errs.pincode = 'Required';
    else if (!/^\d{6}$/.test(address.pincode.trim())) errs.pincode = 'Enter 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handle input change ───────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Handle Razorpay payment ───────────────
  const handleRazorpayPayment = async (orderId) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Failed to load payment gateway. Please try again.');
      return false;
    }

    try {
      const paymentData = await initiatePayment(orderId).unwrap();
      const data = paymentData.data;

      return new Promise((resolve) => {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'DS Enterprises',
          description: 'Order Payment',
          order_id: data.razorpayOrderId,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();
              resolve(true);
            } catch {
              toast.error('Payment verification failed');
              resolve(false);
            }
          },
          modal: {
            ondismiss: () => {
              toast.error('Payment cancelled');
              resolve(false);
            },
          },
          prefill: {
            name: address.fullName,
            contact: address.phone,
          },
          theme: { color: '#E91E63' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch {
      toast.error('Failed to initiate payment');
      return false;
    }
  };

  // ── Place Order ───────────────────────────
  const handlePlaceOrder = async () => {
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    setProcessing(true);
    try {
      const orderPayload = {
        shippingAddress: address,
        paymentMethod,
        couponCode: couponCode.trim() || undefined,
      };

      const result = await createOrder(orderPayload).unwrap();
      const order = result.data;

      if (paymentMethod === 'razorpay') {
        const paid = await handleRazorpayPayment(order._id);
        if (!paid) {
          setProcessing(false);
          return;
        }
      }

      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  // ── Loading / Empty ───────────────────────
  if (cartLoading) {
    return (
      <section className={`container ${styles.checkoutPage}`}>
        <div className={styles.loading}>Loading checkout...</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={`container ${styles.checkoutPage}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <Link to="/shop" className={styles.emptyBtn}>
            <FiArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const isSubmitting = creatingOrder || processing;

  return (
    <section className={`container ${styles.checkoutPage}`}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        {/* ─── Left: Form Panel ─────────────── */}
        <div className={styles.formPanel}>
          {/* Shipping Address */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiMapPin size={18} /> Shipping Address
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  className={styles.input}
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone *</label>
                <input
                  className={styles.input}
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address Line 1 *</label>
                <input
                  className={styles.input}
                  name="line1"
                  value={address.line1}
                  onChange={handleChange}
                  placeholder="House / Flat / Building"
                />
                {errors.line1 && <span className={styles.error}>{errors.line1}</span>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address Line 2</label>
                <input
                  className={styles.input}
                  name="line2"
                  value={address.line2}
                  onChange={handleChange}
                  placeholder="Street, Area, Landmark"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>City *</label>
                <input
                  className={styles.input}
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                {errors.city && <span className={styles.error}>{errors.city}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>State *</label>
                <input
                  className={styles.input}
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
                {errors.state && <span className={styles.error}>{errors.state}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pincode *</label>
                <input
                  className={styles.input}
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  maxLength={6}
                />
                {errors.pincode && <span className={styles.error}>{errors.pincode}</span>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiCreditCard size={18} /> Payment Method
            </h2>
            <div className={styles.paymentOptions}>
              <div
                className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentOptionActive : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className={`${styles.paymentRadio} ${paymentMethod === 'cod' ? styles.paymentRadioActive : ''}`} />
                <div>
                  <div className={styles.paymentLabel}>💵 Cash on Delivery</div>
                  <div className={styles.paymentDesc}>Pay when your order arrives</div>
                </div>
              </div>

              <div
                className={`${styles.paymentOption} ${paymentMethod === 'razorpay' ? styles.paymentOptionActive : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <div className={`${styles.paymentRadio} ${paymentMethod === 'razorpay' ? styles.paymentRadioActive : ''}`} />
                <div>
                  <div className={styles.paymentLabel}>💳 Pay Online (Razorpay)</div>
                  <div className={styles.paymentDesc}>Credit/Debit Card, UPI, Netbanking</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <FiTag size={18} /> Have a Coupon?
            </h2>
            <div className={styles.couponRow}>
              <input
                className={styles.couponInput}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
              />
              <button className={styles.couponBtn} type="button">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right: Order Summary ────────── */}
        <div className={styles.summaryPanel}>
          <div className={styles.summaryCard}>
            <h2 className={styles.cardTitle}>Order Summary</h2>

            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item._id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImg}>
                    <img src={item.product.images?.[0]?.url || '/placeholder.png'} alt={item.product.name} />
                  </div>
                  <div className={styles.summaryItemInfo}>
                    <div className={styles.summaryItemName}>{item.product.name}</div>
                    <div className={styles.summaryItemQty}>Qty: {item.quantity}</div>
                  </div>
                  <div className={styles.summaryItemPrice}>
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <hr className={styles.divider} />

            <div className={styles.summaryRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span className={styles.summaryValue}>₹{mrpTotal.toLocaleString('en-IN')}</span>
            </div>

            {savings > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span className={styles.savingsValue}>−₹{savings.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.summaryValue}>
                {shipping === 0 ? (
                  <span style={{ color: 'var(--color-success)' }}>FREE</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              className={styles.placeOrderBtn}
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : paymentMethod === 'cod'
                  ? '📦 Place Order (COD)'
                  : '💳 Pay & Place Order'}
            </button>

            <div className={styles.secureNote}>
              <FiShield size={14} /> Secure & encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
