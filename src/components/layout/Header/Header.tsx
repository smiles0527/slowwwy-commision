import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollPosition } from '@hooks/useScrollPosition';
import styles from './Header.module.css';

export function Header() {
  const { isScrolled } = useScrollPosition();

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          SLOWWWY
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/products" className={styles.navLink}>Products</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
          <Link to="/contact" className={styles.navLink}>Contact</Link>
        </nav>
      </div>
    </motion.header>
  );
}
