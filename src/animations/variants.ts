/**
 * Framer Motion animation variants for the Slowwwy storefront.
 * Performance-first: uses transform/opacity only for GPU-accelerated animations.
 */
import type { Variants, Transition, Easing } from 'framer-motion';

/* ── Shared easing curves ── */
export const easeOutExpo: Easing = [0.16, 1, 0.3, 1];
export const easeOutQuart: Easing = [0.25, 1, 0.5, 1];
export const easeInOutQuad: Easing = [0.45, 0, 0.55, 1];

/* ── Shared transitions ── */
export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
  mass: 0.8,
};

/* ── Fade In ── */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/* ── Fade Up (scroll reveal) ── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

/* ── Fade Down ── */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/* ── Scale In ── */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutQuart },
  },
};

/* ── Stagger container ── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/* ── Stagger item (use inside a stagger container) ── */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

/* ── Slide from left ── */
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/* ── Slide from right ── */
export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/* ── Page transition ── */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: easeInOutQuad },
  },
};

/* ── Hover lift (for product cards) ── */
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: easeOutQuart },
  },
};
