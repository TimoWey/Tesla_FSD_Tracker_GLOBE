/**
 * Application Constants
 * Centralized configuration for the Tesla FSD Tracker Globe application
 */

// Status configurations
export const FSD_STATUSES = {
  FULLY_RELEASED: 'Fully Released',
  PARTIALLY_RELEASED: 'Partially Released',
  TESTING: 'Testing',
  PENDING: 'Pending',
  NOT_AVAILABLE: 'Not Available'
};

// Status color mappings
export const STATUS_COLORS = {
  [FSD_STATUSES.FULLY_RELEASED]: '#22C55E',      // Success green
  [FSD_STATUSES.PARTIALLY_RELEASED]: '#86EFAC',  // Light green
  [FSD_STATUSES.TESTING]: '#F97316',             // Warning orange
  [FSD_STATUSES.PENDING]: '#3B82F6',             // Info blue
  [FSD_STATUSES.NOT_AVAILABLE]: '#EF4444'        // Error red
};

// Globe configuration
export const GLOBE_CONFIG = {
  MOBILE: {
    ANTIALIAS: false,
    POWER_PREFERENCE: 'default',
    POLYGON_RESOLUTION: 3,
    DAMPING_FACTOR: 0.1,
    AUTO_ROTATE_SPEED: 0.15,
    INITIAL_ALTITUDE: 3.0,
    BUMP_SCALE: 5
  },
  DESKTOP: {
    ANTIALIAS: true,
    POWER_PREFERENCE: 'high-performance',
    POLYGON_RESOLUTION: 5,
    DAMPING_FACTOR: 0.15,
    AUTO_ROTATE_SPEED: 0.25,
    INITIAL_ALTITUDE: 2.5,
    BUMP_SCALE: 10
  }
};

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Z-index layers
export const Z_INDEX = {
  GLOBE: 10,
  SIDEBAR: 50,
  TOOLTIP: 60,
  MODAL: 70,
  OVERLAY: 80
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

// Error messages
export const ERROR_MESSAGES = {
  WEBGL_NOT_SUPPORTED: 'WebGL is not supported in your browser',
  GLOBE_INIT_FAILED: 'Failed to initialize 3D globe',
  DATA_LOAD_FAILED: 'Failed to load FSD data',
  CONFIG_MISSING: 'Required configuration is missing'
};

// Success messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'FSD data loaded successfully',
  GLOBE_READY: '3D globe is ready'
};
