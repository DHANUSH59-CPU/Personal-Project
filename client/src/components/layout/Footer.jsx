import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import styles from '../../styles/components/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src="/logo.jpeg" alt="DS Enterprises" className={styles.logoImg} />
            <span>DS Enterprises</span>
          </div>
          <p className={styles.tagline}>
            Premium sanitary pads crafted with care. Because your comfort matters.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
            <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
          </div>
        </div>

        <div className={styles.linksGroup}>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Track Order</Link>
        </div>

        <div className={styles.linksGroup}>
          <h4>Support</h4>
          <a href="#">FAQ</a>
          <a href="#">Return Policy</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className={styles.linksGroup}>
          <h4>Contact</h4>
          <a href="mailto:sukanyavsinchana@gmail.com"><FiMail size={14} /> sukanyavsinchana@gmail.com</a>
          <a href="tel:+918722555527"><FiPhone size={14} /> +91 87225 55527</a>
          <a href="#"><FiMapPin size={14} /> Chikkabalapura, India</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} DS Enterprises. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
