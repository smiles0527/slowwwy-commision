import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

export function Header() {
  return (
    <motion.header
      className={styles.navBar}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.navLeft}>
          <div className={styles.logoMark}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h8" />
            </svg>
          </div>
          <span className={styles.logoText}>S L O W W W Y</span>
        </Link>

        <nav className={styles.navRight}>
          <Link to="/about" className={styles.navLink}>
            About
          </Link>
          <Link to="/commission" className={styles.navLink}>
            Commission
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
