import { motion } from 'framer-motion';
import { pageTransition } from '@animations/variants';
import { Section } from '@components/ui';

export function Contact() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Section>
        <h2>Contact</h2>
        <p>Get in touch — this page will be populated with the Banini UI.</p>
      </Section>
    </motion.div>
  );
}
