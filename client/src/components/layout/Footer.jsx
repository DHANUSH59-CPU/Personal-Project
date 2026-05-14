import { memo } from 'react';
import styles from '../../styles/components/Footer.module.css';

const IcoWA = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="#25D366"/>
    <path d="M13.8 12.1c-.18-.09-1.08-.53-1.25-.59-.17-.06-.29-.09-.41.09-.12.18-.47.59-.57.71-.1.12-.21.13-.39.05-.63-.27-1.31-.7-1.86-1.26-.4-.46-.75-1.03-.9-1.6-.09-.2 0-.3.08-.38l.27-.32c.09-.1.13-.2.18-.34.05-.14 0-.28-.05-.38L8.4 7.27c-.19-.5-.38-.48-.55-.48h-.36c-.17 0-.43.06-.65.29C6.4 7.5 6 8.11 6 8.88c0 .9.63 1.78.72 1.9.08.12 1.25 2 3.18 2.72.44.17.79.27 1.06.34.45.1.86.09 1.18 0 .36-.1 1.1-.44 1.26-.87.16-.43.16-.8.1-.88-.06-.06-.18-.1-.36-.18z" fill="#fff"/>
  </svg>
);

const Footer = memo(() => (
  <footer className={styles.footer}>
    <div className={styles.brand}>
      <div className={styles.brandName}>NewFeel</div>
      <p className={styles.tagline}>
        Thinner, Softer &amp; Simply Better.<br />
        Made with care for every woman.
      </p>
    </div>

    <a href="https://wa.me/918722555527" className={styles.waLink} target="_blank" rel="noopener noreferrer">
      <IcoWA />
      <span className={styles.waText}>Chat on WhatsApp</span>
    </a>

    <div className={styles.socials}>
      <span>Instagram</span>
      <span>Facebook</span>
      <span>YouTube</span>
    </div>

    <div className={styles.bottom}>
      &copy; {new Date().getFullYear()} NewFeel Ultra Thin. All rights reserved.<br />
      Discreet packaging · Free returns · Pan-India delivery
    </div>
  </footer>
));

Footer.displayName = 'Footer';

export default Footer;
