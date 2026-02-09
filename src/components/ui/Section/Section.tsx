import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@animations/variants';
import { useInView } from '@hooks/useInView';
import styles from './Section.module.css';

interface SectionProps {
  children: ReactNode;
  padded?: boolean;
  contained?: boolean;
  animate?: boolean;
  className?: string;
}

export function Section({
  children,
  padded = true,
  contained = true,
  animate = true,
  className = '',
}: SectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  const content = contained ? (
    <div className={styles.container}>{children}</div>
  ) : (
    children
  );

  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={`${styles.section} ${padded ? styles.padded : ''} ${className}`}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${styles.section} ${padded ? styles.padded : ''} ${className}`}
    >
      {content}
    </div>
  );
}
