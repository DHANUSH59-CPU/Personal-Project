import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../api/orderApi';
import styles from '../../styles/pages/ManageOrders.module.css';

const statusColors = {
  processing: { bg: 'rgba(33,150,243,0.1)', color: '#1565c0' },
  confirmed: { bg: 'rgba(76,175,80,0.1)', color: '#2e7d32' },
  shipped: { bg: 'rgba(255,152,0,0.1)', color: '#e65100' },
  out_for_delivery: { bg: 'rgba(255,87,34,0.1)', color: '#d84315' },
  delivered: { bg: 'rgba(76,175,80,0.15)', color: '#1b5e20' },
  cancelled: { bg: 'rgba(233,30,99,0.1)', color: '#c2185b' },
};

const paymentColors = {
  pending: { bg: 'rgba(255,152,0,0.1)', color: '#e65100' },
  paid: { bg: 'rgba(76,175,80,0.1)', color: '#2e7d32' },
  failed: { bg: 'rgba(233,30,99,0.1)', color: '#c2185b' },
};

const ManageOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orders = data?.data?.orders || [];

  const handleStatusChange = async (id, orderStatus) => {
    try {
      await updateStatus({ id, orderStatus }).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  // Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'processing').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered').length;

  if (isLoading) return <div className={styles.loading}>Loading orders...</div>;

  return (
    <div className={styles.ordersPage}>
      <h1>Manage Orders</h1>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalOrders}</div>
          <div className={styles.statLabel}>Total Orders</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className={styles.statLabel}>Revenue</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pendingOrders}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{deliveredOrders}</div>
          <div className={styles.statLabel}>Delivered</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>No orders yet.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const sc = statusColors[order.orderStatus] || statusColors.processing;
                const pc = paymentColors[order.paymentStatus] || paymentColors.pending;
                const addr = order.shippingAddress || {};
                const isExpanded = expandedOrder === order._id;
                return (
                  <>
                    <tr key={order._id} onClick={() => toggleExpand(order._id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <span className={styles.orderId}>
                          {isExpanded ? '▼' : '▶'} #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className={styles.customerName}>{order.user?.name || 'N/A'}</div>
                        <div className={styles.customerEmail}>{order.user?.email || ''}</div>
                      </td>
                      <td>{order.items.length}</td>
                      <td>
                        <span className={styles.amount}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <span className={styles.badge} style={{ background: pc.bg, color: pc.color }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={order.orderStatus}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(order._id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ borderColor: sc.color, color: sc.color }}
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <span className={styles.date}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order._id}-addr`} className={styles.addressRow}>
                        <td colSpan="7">
                          <div className={styles.addressDetail}>
                            <strong>📦 Shipping Address:</strong>
                            <div className={styles.addressGrid}>
                              <div><span className={styles.addrLabel}>Name:</span> {addr.fullName || 'N/A'}</div>
                              <div><span className={styles.addrLabel}>Phone:</span> {addr.phone || 'N/A'}</div>
                              <div><span className={styles.addrLabel}>Address:</span> {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</div>
                              <div><span className={styles.addrLabel}>City:</span> {addr.city || 'N/A'}</div>
                              <div><span className={styles.addrLabel}>State:</span> {addr.state || 'N/A'}</div>
                              <div><span className={styles.addrLabel}>Pincode:</span> {addr.pincode || 'N/A'}</div>
                            </div>
                            {order.items.length > 0 && (
                              <div style={{ marginTop: '10px' }}>
                                <strong>🛒 Items:</strong>
                                {order.items.map((item, i) => (
                                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>
                                    • {item.product?.name || 'Product'} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;

