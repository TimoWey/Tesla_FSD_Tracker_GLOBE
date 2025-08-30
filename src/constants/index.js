/**
 * Application Constants - Simplified Version
 */

// Status configurations
export const FSD_STATUSES = {
  FULLY_RELEASED: 'Fully Released',
  PARTIALLY_RELEASED: 'Partially Released',
  TESTING: 'Testing',
  PENDING: 'Pending',
  NOT_AVAILABLE: 'Not Available'
};

// Globe configuration
export const GLOBE_CONFIG = {
  MOBILE: {
    ANTIALIAS: false,
    POWER_PREFERENCE: 'default',
    POLYGON_RESOLUTION: 3,
    DAMPING_FACTOR: 0.1,
    AUTO_ROTATE_SPEED: 0.15,
    INITIAL_ALTITUDE: 4.0,
    BUMP_SCALE: 5
  },
  DESKTOP: {
    ANTIALIAS: true,
    POWER_PREFERENCE: 'high-performance',
    POLYGON_RESOLUTION: 5,
    DAMPING_FACTOR: 0.15,
    AUTO_ROTATE_SPEED: 0.25,
    INITIAL_ALTITUDE: 2,
    BUMP_SCALE: 10
  }
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
};

// Default values
export const DEFAULTS = {
  SIDEBAR_WIDTH: 400,
  MOBILE_SIDEBAR_WIDTH: '100vw',
  TOOLTIP_DELAY: 2000,
  AUTO_ROTATE_RESUME_DELAY: 3000
};
