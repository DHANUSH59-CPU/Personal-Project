import { Navigate, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiArrowLeft } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/components/AdminLayout.module.css';

const AdminLayout = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <Navigate to="/" replace />;

  const navItems = [
    { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <FiBox />, label: 'Products' },
    { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.backLink}>
            <FiArrowLeft /> Back to Store
          </Link>
          <h2 className={styles.title}>Admin Panel</h2>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={styles.navItem}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
