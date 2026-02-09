import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import styles from './Home.module.css';

export function Home() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            <p className={styles.heroMeta}>Keyboards</p>
            <h1 className={styles.heroTitle}>Slowwwy's commission</h1>
          </motion.div>

          <motion.div
            className={styles.heroMediaStrip}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
          >
            <div className={styles.heroMainImage}>
              <div className={styles.placeholder}>Hero Image</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={styles.gallery}>
        <div className="container">
          <motion.div
            className={styles.galleryHeader}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className={styles.galleryTitle}>Gallery</h2>
          </motion.div>

          <motion.div
            className={styles.galleryGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Column 1 */}
            <div className={styles.galleryColumn}>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemLarge}`} variants={staggerItem}>
                <div className={styles.placeholder}>Board 01</div>
              </motion.div>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemSmall}`} variants={staggerItem}>
                <div className={styles.placeholder}>Board 02</div>
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className={styles.galleryColumn}>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemMedium}`} variants={staggerItem}>
                <div className={styles.placeholder}>Board 03</div>
              </motion.div>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemMedium}`} variants={staggerItem}>
                <div className={styles.placeholder}>Board 04</div>
              </motion.div>
            </div>

            {/* Column 3 */}
            <div className={styles.galleryColumn}>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemSmall}`} variants={staggerItem}>
                <div className={styles.placeholder}>Board 05</div>
              </motion.div>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemLarge}`} variants={staggerItem}>
                <div className={styles.placeholder}>Board 06</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
