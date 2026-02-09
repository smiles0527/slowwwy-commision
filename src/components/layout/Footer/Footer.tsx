import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>SLOWWWY</Link>
            <p className={styles.tagline}>
              Precision crafted keyboards for the discerning typist.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <Link to="/products" className={styles.link}>All Products</Link>
            <Link to="/products" className={styles.link}>Keyboards</Link>
            <Link to="/products" className={styles.link}>Keycaps</Link>
            <Link to="/products" className={styles.link}>Accessories</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <Link to="/about" className={styles.link}>About</Link>
            <Link to="/contact" className={styles.link}>Contact</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <Link to="/contact" className={styles.link}>Help Center</Link>
            <Link to="/contact" className={styles.link}>Shipping</Link>
            <Link to="/contact" className={styles.link}>Returns</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Slowwwy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
