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
      <section className={styles.confirmPage}>
        <div className="spinner" />
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className={styles.confirmPage}>
        <div className={styles.errorState}>
          <p>Order not found.</p>
          <a href="/shop">Back to Shop</a>
        </div>
      </section>
    );
  }

  const addr = order.shippingAddress;

  return (
    <section className={styles.confirmPage}>
      {/* ─── Success Banner ─────────────── */}
      <div className={styles.successBanner}>
        <span className={styles.successIcon}>🎉</span>
        <h1 className={styles.successTitle}>Order Placed!</h1>
        <p className={styles.orderIdRow}>
          Order ID: <span className={styles.orderIdCode}>#{order._id.slice(-8).toUpperCase()}</span>
        </p>
      </div>

      {/* ─── Shipping Address ─────────────── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>
          <FiMapPin size={14} /> Shipping Address
        </h3>
        <div className={styles.addressText}>
          <strong>{addr.fullName}</strong><br />
          {addr.line1}{addr.line2 && `, ${addr.line2}`}<br />
          {addr.city}, {addr.state} — {addr.pincode}<br />
          {addr.phone}
        </div>
      </div>

      {/* ─── Order Status ─────────────────── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>
          <FiCreditCard size={14} /> Order Status
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
            <span className={styles.methodText}>{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* ─── Order Items ──────────────────── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Order Items</h3>
        <div className={styles.itemsList}>
          {order.items.map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <div className={styles.itemImg}>
                <img src={item.image || '/favicon.svg'} alt={item.name} />
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
              <span className={styles.savingsValue}>−₹{order.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className={styles.priceRow}>
            <span>Shipping</span>
            {order.shippingCost === 0 ? (
              <span className={styles.freeShipping}>FREE</span>
            ) : (
              <span className={styles.priceValue}>₹{order.shippingCost}</span>
            )}
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* ─── Actions ──────────────────────── */}
      <div className={styles.actions}>
        <Link to="/shop" className={styles.shopBtn}>
          <FiShoppingBag size={16} /> Continue Shopping
        </Link>
        <Link to="/orders" className={styles.ordersBtn}>
          <FiList size={16} /> View All Orders
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmation;
