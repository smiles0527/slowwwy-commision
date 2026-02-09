/**
 * GSAP animation utilities for Slowwwy.
 * Use for scroll-driven and complex timeline animations.
 */
import gsap from 'gsap';

/**
 * Register GSAP plugins that will be used across the app.
 * Call this once in main.tsx.
 */
export function registerGSAPPlugins(): void {
  // ScrollTrigger and other plugins can be registered here
  // when needed. GSAP core is always available.
  gsap.config({
    nullTargetWarn: false,
    force3D: true,
  });
}

/**
 * Create a smooth parallax effect on an element.
 */
export function createParallax(
  element: string | Element,
  speed: number = 0.5,
): gsap.core.Tween {
  return gsap.to(element, {
    y: () => window.innerHeight * speed * -1,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Animate text characters with staggered reveal.
 */
export function animateTextReveal(
  selector: string | Element,
  options?: { delay?: number; duration?: number; stagger?: number },
): gsap.core.Tween {
  const { delay = 0, duration = 0.8, stagger = 0.03 } = options ?? {};

  return gsap.from(selector, {
    opacity: 0,
    y: 40,
    duration,
    stagger,
    delay,
    ease: 'expo.out',
  });
}

/**
 * Create a smooth fade-in on scroll.
 */
export function scrollFadeIn(
  elements: string | Element | Element[],
  options?: { y?: number; duration?: number; stagger?: number },
): void {
  const { y = 60, duration = 1, stagger = 0.15 } = options ?? {};

  gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    stagger,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: elements as gsap.DOMTarget,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}
