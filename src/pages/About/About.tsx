import { motion } from 'framer-motion';
import { pageTransition } from '@animations/variants';
import { Section } from '@components/ui';

export function About() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Section>
        <h2>About Slowwwy</h2>
        <p>Our story — this page will be populated with the Banini UI.</p>
      </Section>
    </motion.div>
  );
}
