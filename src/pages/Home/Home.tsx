import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import { Button } from '@components/ui';
import { Section } from '@components/ui';
import styles from './Home.module.css';

export function Home() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.p
            className={styles.heroLabel}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Premium Custom Keyboards
          </motion.p>

          <motion.h1
            className={styles.heroTitle}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            Crafted for
            <br />
            <span className={styles.accent}>Perfection</span>
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            Every keystroke is an experience. Discover keyboards built with
            meticulous attention to detail, premium materials, and uncompromising quality.
          </motion.p>

          <motion.div
            className={styles.heroCta}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <Button variant="primary" size="lg">
              Explore Collection
            </Button>
            <Button variant="outline" size="lg">
              Our Story
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <Section>
        <motion.div
          className={styles.features}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              variants={staggerItem}
            >
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </motion.div>
  );
}

const features = [
  {
    title: 'CNC Machined',
    description:
      'Precision-cut from solid aluminum billet for unmatched build quality and acoustic performance.',
  },
  {
    title: 'Hot-Swappable',
    description:
      'Swap switches without soldering. Find your perfect feel with complete freedom.',
  },
  {
    title: 'Sound Tuned',
    description:
      'Multi-layer dampening and gasket mounting for a deep, satisfying typing experience.',
  },
];
