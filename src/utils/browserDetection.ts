
/**
 * Browser detection utility
 */

/**
 * Detect browser and version
 */
export function detectBrowser(): {
  name: string;
  version: string;
  compatible: boolean;
  warnings: string[];
  mobile: boolean;
  os: string;
} {
  const ua = navigator.userAgent;
  const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  
  let name = 'Unknown';
  let version = 'Unknown';
  let os = 'Unknown';
  let compatible = true;
  const warnings: string[] = [];
  
  // Extract browser name and version
  if (ua.indexOf('Chrome') !== -1) {
    name = 'Chrome';
    version = ua.match(/Chrome\/([\d.]+)/)![1];
  } else if (ua.indexOf('Firefox') !== -1) {
    name = 'Firefox';
    version = ua.match(/Firefox\/([\d.]+)/)![1];
  } else if (ua.indexOf('Safari') !== -1) {
    name = 'Safari';
    version = ua.match(/Version\/([\d.]+)/)![1];
  } else if (ua.indexOf('Edge') !== -1 || ua.indexOf('Edg') !== -1) {
    name = 'Edge';
    version = ua.match(/Edge\/([\d.]+)/)![1] || ua.match(/Edg\/([\d.]+)/)![1];
  } else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) {
    name = 'Internet Explorer';
    compatible = false;
    warnings.push('Internet Explorer is not supported. Please use a modern browser.');
  }
  
  // Extract OS
  if (ua.indexOf('Windows') !== -1) {
    os = 'Windows';
  } else if (ua.indexOf('Mac') !== -1) {
    os = 'macOS';
  } else if (ua.indexOf('Linux') !== -1) {
    os = 'Linux';
  } else if (ua.indexOf('Android') !== -1) {
    os = 'Android';
  } else if (ua.indexOf('iOS') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
    os = 'iOS';
  }
  
  return { name, version, compatible, warnings, mobile, os };
}

/**
 * Check for feature support
 */
export function checkFeatureSupport(): Record<string, boolean> {
  return {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    cookies: navigator.cookieEnabled,
    webp: testWebP(),
    webgl: testWebGL(),
    css3: testCSS3(),
    es6: testES6(),
    serviceWorker: 'serviceWorker' in navigator,
    indexedDB: 'indexedDB' in window,
    webSockets: 'WebSocket' in window,
    fetch: 'fetch' in window,
    webRTC: 'RTCPeerConnection' in window,
    intl: 'Intl' in window
  };
}

/**
 * Test WebP support
 */
function testWebP(): boolean {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check WebP support
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Test WebGL support
 */
function testWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
              (canvas.getContext('webgl') || 
               canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/**
 * Test CSS3 support
 */
function testCSS3(): boolean {
  return 'transition' in document.documentElement.style;
}

/**
 * Test ES6 support
 */
function testES6(): boolean {
  try {
    // Check for basic ES6 features
    eval('let a = (x) => x+1; const b = 2; class C {}');
    return true;
  } catch (e) {
    return false;
  }
}
