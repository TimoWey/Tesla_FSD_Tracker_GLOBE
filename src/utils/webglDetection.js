/**
 * WebGL Detection Utility
 * Provides WebGL support detection and mobile-optimized settings for the 3D globe
 */

import { GLOBE_CONFIG } from '../constants';

/**
 * Detects WebGL support and provides detailed information about the graphics capabilities
 * @returns {Object} WebGL support information
 */
export const detectWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, reason: 'WebGL not supported' };
    }

    // Check for common WebGL extensions that might be needed
    const extensions = {
      loseContext: gl.getExtension('WEBGL_lose_context'),
      depthTexture: gl.getExtension('WEBGL_depth_texture'),
      textureFloat: gl.getExtension('OES_texture_float')
    };

    // Check maximum texture size (important for mobile)
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    
    // Get renderer info for debugging
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';

    return {
      supported: true,
      maxTextureSize,
      maxRenderbufferSize,
      renderer,
      vendor,
      extensions
    };
  } catch (error) {
    return { 
      supported: false, 
      reason: `WebGL detection failed: ${error.message}` 
    };
  }
};

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
};

/**
 * Returns mobile-optimized settings for the 3D globe
 * @returns {Object} Mobile-optimized configuration
 */
export const getMobileOptimizedSettings = () => {
  const isMobile = isMobileDevice();
  
  return isMobile ? GLOBE_CONFIG.MOBILE : GLOBE_CONFIG.DESKTOP;
};

/**
 * Gets device-specific performance recommendations
 * @returns {Object} Performance recommendations
 */
export const getPerformanceRecommendations = () => {
  const isMobile = isMobileDevice();
  const webglSupport = detectWebGLSupport();
  
  if (!webglSupport.supported) {
    return {
      canRun: false,
      reason: webglSupport.reason,
      recommendations: ['Update your browser', 'Enable hardware acceleration', 'Check graphics drivers']
    };
  }

  if (isMobile) {
    return {
      canRun: true,
      performance: 'mobile-optimized',
      recommendations: [
        'Close other apps for better performance',
        'Use landscape mode for better view',
        'Ensure device is not in power-saving mode'
      ]
    };
  }

  return {
    canRun: true,
    performance: 'high-performance',
    recommendations: [
      'Use high-quality graphics settings',
      'Enable hardware acceleration in browser',
      'Close unnecessary browser tabs'
    ]
  };
};
