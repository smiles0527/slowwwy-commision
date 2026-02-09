import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <span>&copy; {currentYear} Slowwwy. All rights reserved.</span>
        <div className={styles.footerRight}>
          <Link to="/">Home</Link>
          <Link to="/commission">Commission</Link>
        </div>
      </div>
    </footer>
  );
}
