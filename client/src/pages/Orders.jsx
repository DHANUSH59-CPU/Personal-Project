import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiShoppingBag, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetUserOrdersQuery, useCancelOrderMutation } from '../api/orderApi';
import styles from '../styles/pages/Orders.module.css';

const statusColors = {
  processing: '#2196F3',
  confirmed: '#4CAF50',
  shipped: '#FF9800',
  out_for_delivery: '#FF5722',
  delivered: '#4CAF50',
  cancelled: '#E91E63',
};

const CANCELLABLE = ['processing', 'confirmed'];

const Orders = () => {
  const { data, isLoading } = useGetUserOrdersQuery();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const orders = data?.data?.orders || [];

  const handleCancel = async (e, orderId) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(orderId).unwrap();
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <section className={`container ${styles.page}`}>
        <div className={styles.loading}>Loading orders...</div>
      </section>
    );
  }

  return (
    <section className={`container ${styles.page}`}>
      <h1 className={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No orders yet</h2>
          <p className={styles.emptyDesc}>You haven't placed any orders. Start shopping to see your orders here.</p>
          <Link to="/shop" className={styles.emptyBtn}>
            <FiShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCardWrap}>
              <Link to={`/orders/${order._id}`} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderIdBlock}>
                    <FiPackage size={18} />
                    <span className={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{ background: `${statusColors[order.orderStatus]}15`, color: statusColors[order.orderStatus] }}
                  >
                    {order.orderStatus?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className={styles.orderMeta}>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                  <span>•</span>
                  <span className={styles.orderTotal}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className={styles.thumbWrap}>
                      <img src={item.image || '/placeholder.png'} alt={item.name} className={styles.thumb} />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className={styles.moreItems}>+{order.items.length - 3}</div>
                  )}
                </div>

                <FiChevronRight className={styles.chevron} size={20} />
              </Link>

              {CANCELLABLE.includes(order.orderStatus) && (
                <button
                  className={styles.cancelBtn}
                  onClick={(e) => handleCancel(e, order._id)}
                  disabled={cancelling}
                >
                  <FiX size={14} /> Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
