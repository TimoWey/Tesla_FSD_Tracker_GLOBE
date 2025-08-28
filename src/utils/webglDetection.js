// WebGL detection utility for mobile compatibility
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

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
};

export const getMobileOptimizedSettings = () => {
  const isMobile = isMobileDevice();
  
  return {
    antialias: !isMobile,
    powerPreference: isMobile ? 'default' : 'high-performance',
    alpha: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    // Reduce quality settings on mobile
    polygonResolution: isMobile ? 3 : 5,
    dampingFactor: isMobile ? 0.1 : 0.15,
    autoRotateSpeed: isMobile ? 0.15 : 0.25,
    initialAltitude: isMobile ? 3.0 : 2.5
  };
};
