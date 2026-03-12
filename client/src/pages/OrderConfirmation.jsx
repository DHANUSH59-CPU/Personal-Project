import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiList, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { useGetOrderQuery } from '../api/orderApi';
import styles from '../styles/pages/OrderConfirmation.module.css';

const getPaymentBadge = (status) => {
  if (status === 'paid') return <span className={`${styles.badge} ${styles.badgePaid}`}>Paid</span>;
  return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
};

const getOrderBadge = (status) => {
  const map = {
    processing: styles.badgeProcessing,
    confirmed: styles.badgeConfirmed,
    shipped: styles.badgeProcessing,
    delivered: styles.badgePaid,
    cancelled: styles.badgePending,
  };
  return (
    <span className={`${styles.badge} ${map[status] || styles.badgeProcessing}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderQuery(id);
  const order = data?.data;

  if (isLoading) {
    return (
      <section className={`container ${styles.page}`}>
        <div className={styles.loading}>Loading order details...</div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className={`container ${styles.page}`}>
        <div className={styles.errorState}>
          <h2>Order not found</h2>
          <Link to="/shop">Back to Shop</Link>
        </div>
      </section>
    );
  }

  const addr = order.shippingAddress;

  return (
    <section className={`container ${styles.page}`}>
      {/* ─── Success Banner ─────────────── */}
      <div className={styles.successBanner}>
        <div className={styles.successIcon}>✅</div>
        <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
        <p className={styles.orderId}>
          Order ID: <span className={styles.orderIdCode}>#{order._id.slice(-8).toUpperCase()}</span>
        </p>
      </div>

      {/* ─── Details Grid ───────────────── */}
      <div className={styles.detailsGrid}>
        {/* Shipping Address */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <FiMapPin size={16} /> Shipping Address
          </h3>
          <div className={styles.addressText}>
            <strong>{addr.fullName}</strong>
            <br />
            {addr.line1}
            {addr.line2 && <>, {addr.line2}</>}
            <br />
            {addr.city}, {addr.state} — {addr.pincode}
            <br />
            📞 {addr.phone}
          </div>
        </div>

        {/* Order Status */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <FiCreditCard size={16} /> Order Status
          </h3>
          <div className={styles.statusRow}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Payment</span>
              {getPaymentBadge(order.paymentStatus)}
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Order</span>
              {getOrderBadge(order.orderStatus)}
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Method</span>
              <span style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                {order.paymentMethod}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Order Items ────────────────── */}
      <div className={styles.itemsCard}>
        <h3 className={styles.cardTitle}>Order Items</h3>
        <div className={styles.itemsList}>
          {order.items.map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <div className={styles.itemImg}>
                <img src={item.image || '/placeholder.png'} alt={item.name} />
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemQty}>Qty: {item.quantity}</div>
              </div>
              <div className={styles.itemPrice}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.priceSummary}>
          <div className={styles.priceRow}>
            <span>Items Total</span>
            <span className={styles.priceValue}>₹{order.itemsTotal.toLocaleString('en-IN')}</span>
          </div>
          {order.discount > 0 && (
            <div className={styles.priceRow}>
              <span>Discount</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                −₹{order.discount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          <div className={styles.priceRow}>
            <span>Shipping</span>
            <span className={styles.priceValue}>
              {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
            </span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* ─── Actions ────────────────────── */}
      <div className={styles.actions}>
        <Link to="/shop" className={styles.shopBtn}>
          <FiShoppingBag size={18} /> Continue Shopping
        </Link>
        <Link to="/orders" className={styles.ordersBtn}>
          <FiList size={18} /> View All Orders
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmation;
