import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTrendingUp, FiBox } from 'react-icons/fi';
import { useGetDashboardStatsQuery } from '../../api/adminApi';
import styles from '../../styles/pages/AdminDashboard.module.css';

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data || {};

  const cards = [
    {
      label: 'Total Revenue',
      value: isLoading ? '...' : `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: <FiDollarSign />,
      color: '#4CAF50',
      bg: 'rgba(76, 175, 80, 0.08)',
    },
    {
      label: 'Total Orders',
      value: isLoading ? '...' : stats.totalOrders || 0,
      icon: <FiShoppingCart />,
      color: '#2196F3',
      bg: 'rgba(33, 150, 243, 0.08)',
    },
    {
      label: 'Total Products',
      value: isLoading ? '...' : stats.totalProducts || 0,
      icon: <FiPackage />,
      color: '#FF9800',
      bg: 'rgba(255, 152, 0, 0.08)',
    },
    {
      label: 'Total Users',
      value: isLoading ? '...' : stats.totalUsers || 0,
      icon: <FiUsers />,
      color: '#E91E63',
      bg: 'rgba(233, 30, 99, 0.08)',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Overview of your store performance</p>
      </div>

      <div className={styles.statsGrid}>
        {cards.map((card, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{card.label}</span>
              <span className={styles.statValue} style={{ color: card.color }}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/products" className={styles.actionCard}>
            <FiBox size={20} />
            <span>Manage Products</span>
          </a>
          <a href="/admin/orders" className={styles.actionCard}>
            <FiShoppingCart size={20} />
            <span>View Orders</span>
          </a>
          <a href="/admin/users" className={styles.actionCard}>
            <FiUsers size={20} />
            <span>Manage Users</span>
          </a>
          <a href="/shop" className={styles.actionCard}>
            <FiTrendingUp size={20} />
            <span>Visit Store</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
