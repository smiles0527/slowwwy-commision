import { motion } from 'framer-motion';
import { pageTransition } from '@animations/variants';
import { Section } from '@components/ui';

export function Products() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Section>
        <h2>Products</h2>
        <p>Collection coming soon — this page will be populated with the Banini UI.</p>
      </Section>
    </motion.div>
  );
}
