import { motion } from 'framer-motion';
import { pageTransition, fadeUp } from '@animations/variants';
import styles from './Commission.module.css';

export function Commission() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className={styles.section}>
        <div className="container">
          <motion.div
            className={styles.content}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <p className={styles.label}>Commissions</p>
            <h1 className={styles.title}>Coming soon</h1>
            <p className={styles.description}>
              We're preparing something special. Stay tuned.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
