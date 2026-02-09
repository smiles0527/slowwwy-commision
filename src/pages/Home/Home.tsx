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
            <p className={styles.heroMeta}>Slow crafted keyboards</p>
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
              <img
                src="https://storage.googleapis.com/banani-generated-images/generated-images/844925eb-3daa-4ee0-9ff2-fa24c5377351.jpg"
                alt="Slowwwy commission hero"
                loading="eager"
              />
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
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/c4481c57-188b-4dd2-9745-c43203a0dab2.jpg"
                  alt="Board 01"
                  loading="lazy"
                />
              </motion.div>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemSmall}`} variants={staggerItem}>
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/10725b8f-72dc-4f0b-b954-0fecffeb3831.jpg"
                  alt="Board 02"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className={styles.galleryColumn}>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemMedium}`} variants={staggerItem}>
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/fbaa4105-dcae-4384-953d-9f8220b8427a.jpg"
                  alt="Board 03"
                  loading="lazy"
                />
              </motion.div>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemMedium}`} variants={staggerItem}>
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/ed8746d4-b77c-4a30-9f2f-82d314478056.jpg"
                  alt="Board 04"
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* Column 3 */}
            <div className={styles.galleryColumn}>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemSmall}`} variants={staggerItem}>
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/e9b89a3c-e8d2-43d7-b626-829a27d3d823.jpg"
                  alt="Board 05"
                  loading="lazy"
                />
              </motion.div>
              <motion.div className={`${styles.galleryItem} ${styles.galleryItemLarge}`} variants={staggerItem}>
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/376a0577-e9ee-41e0-a523-1c751c89e97a.jpg"
                  alt="Board 06"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
