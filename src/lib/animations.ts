import { Variants } from "framer-motion"

// Stagger container animation
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

// Standard fade-up animation
export const fadeUp = (duration = 0.6, y = 30): Variants => ({
  hidden: {
    opacity: 0,
    y,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: "easeOut",
    },
  },
})

// Scale-up transition
export const scaleUp = (duration = 0.6, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
})

// 3D card Y-rotation perspective animation (used in WhyShopOccasions, etc.)
export const cardPerspective: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateY: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateY: 0,
    transition: { 
      type: "spring", 
      stiffness: 90, 
      damping: 15 
    } 
  },
}

// 3D card X-rotation perspective animation (used in MidValuePropsOccasions, etc.)
export const rotateXPerspective: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -45, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 14 
    } 
  },
}

// Sophisticated curtain reveal clipPath animation
export const curtainReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    clipPath: "inset(100% 0 0 0)",
  },
  show: { 
    opacity: 1, 
    y: 0, 
    clipPath: "inset(0% 0 0 0)",
    transition: { 
      duration: 1.2, 
      ease: "easeOut",
    },
  },
}

// Content slide-in animation
export const contentReveal: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      delay: 0.4, 
      ease: "easeOut",
    },
  },
}

// Spring scale up animation
export const springScaleUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
}

// Line animation path length drawing
export const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: "easeInOut",
    },
  },
}
