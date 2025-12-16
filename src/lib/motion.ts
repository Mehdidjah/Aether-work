

export const motionConfig = {

  duration: {
    fast: 0.16,
    normal: 0.22,
    slow: 0.32,
    page: 0.4,
  },
  

  ease: {
    default: [0.16, 1, 0.3, 1],
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    sharp: [0.4, 0, 0.6, 1],
  },
} as const;


export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: motionConfig.duration.fast },
};

export const fadeSlideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { 
    duration: motionConfig.duration.normal,
    ease: motionConfig.ease.default,
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { 
    duration: motionConfig.duration.fast,
    ease: motionConfig.ease.default,
  },
};

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { 
    duration: motionConfig.duration.slow,
    ease: motionConfig.ease.default,
  },
};

export const slideInLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { 
    duration: motionConfig.duration.slow,
    ease: motionConfig.ease.default,
  },
};


export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: motionConfig.duration.normal,
      ease: motionConfig.ease.default,
    },
  },
};


export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: motionConfig.duration.page,
      ease: motionConfig.ease.default,
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: motionConfig.duration.fast,
    },
  },
};


export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: motionConfig.duration.fast },
};

export const hoverLift = {
  whileHover: { y: -2, boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.16)' },
  transition: { duration: motionConfig.duration.fast },
};
