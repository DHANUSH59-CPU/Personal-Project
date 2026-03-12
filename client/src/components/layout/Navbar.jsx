import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import { useLogoutMutation } from '../../api/authApi';
import { clearCredentials } from '../../store/slices/authSlice';
import { useSelector } from 'react-redux';
import { selectCartTotalItems } from '../../store/slices/cartSlice';
import { toggleMobileMenu, closeMobileMenu } from '../../store/slices/uiSlice';
import { useState } from 'react';
import styles from '../../styles/components/Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const cartTotal = useSelector(selectCartTotalItems);
  const mobileMenuOpen = useSelector((s) => s.ui.mobileMenuOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Continue even if API fails
    }
    dispatch(clearCredentials());
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={() => dispatch(closeMobileMenu())}>
          <img src="/logo.jpeg" alt="DS Enterprises" className={styles.logoImg} />
          <span className={styles.logoText}>DS Enterprises</span>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn} id="nav-cart">
            <FiShoppingCart size={20} />
            {cartTotal > 0 && <span className={styles.badge}>{cartTotal}</span>}
          </Link>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="nav-user-menu"
              >
                <FiUser size={20} />
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setDropdownOpen(false)}>Admin Panel</Link>}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn} id="nav-login">Login</Link>
          )}

          {/* Mobile toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => dispatch(toggleMobileMenu())}
            id="nav-mobile-toggle"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" onClick={() => dispatch(closeMobileMenu())}>Home</Link>
          <Link to="/shop" onClick={() => dispatch(closeMobileMenu())}>Shop</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => dispatch(closeMobileMenu())}>Profile</Link>
              <Link to="/orders" onClick={() => dispatch(closeMobileMenu())}>My Orders</Link>
              {isAdmin && <Link to="/admin" onClick={() => dispatch(closeMobileMenu())}>Admin</Link>}
              <button onClick={() => { dispatch(closeMobileMenu()); handleLogout(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => dispatch(closeMobileMenu())}>Login</Link>
              <Link to="/register" onClick={() => dispatch(closeMobileMenu())}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
