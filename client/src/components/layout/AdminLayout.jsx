import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiArrowLeft } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/components/AdminLayout.module.css';

const AdminLayout = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <Navigate to="/" replace />;

  const navItems = [
    { to: '/admin', icon: <FiGrid size={14} />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <FiBox size={14} />, label: 'Products' },
    { to: '/admin/orders', icon: <FiShoppingBag size={14} />, label: 'Orders' },
    { to: '/admin/users', icon: <FiUsers size={14} />, label: 'Users' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.backLink}>
            <FiArrowLeft size={12} /> Back to Store
          </Link>
          <h2 className={styles.title}>Admin</h2>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
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
