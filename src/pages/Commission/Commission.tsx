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
            <p className={styles.label}>Now accepting</p>
            <h1 className={styles.title}>Commission a build</h1>
            <p className={styles.description}>
              Every Slowwwy keyboard is a one-of-one creation. Share your vision,
              and we'll bring it to life with premium materials, hand-tuned
              acoustics, and obsessive attention to detail.
            </p>
            <p className={styles.note}>
              Reach out via Discord or email to start a conversation about your
              dream board. Typical lead time is 4–8 weeks.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
