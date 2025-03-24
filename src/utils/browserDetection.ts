
import { logInfo } from './logger';

/**
 * Simple browser detection utility
 * @returns Information about the current browser
 */
export function detectBrowser(): {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
  compatible: boolean;
  warnings: string[];
} {
  const userAgent = navigator.userAgent;
  const browsers = {
    chrome: /chrome|chromium|crios/i,
    safari: /safari/i,
    firefox: /firefox|fxios/i,
    edge: /edg/i,
    opera: /opera|opr/i,
    ie: /msie|trident/i,
  };

  const os = {
    windows: /windows nt/i,
    mac: /macintosh|mac os x/i,
    linux: /linux/i,
    ios: /iphone|ipad|ipod/i,
    android: /android/i,
  };

  // Determine browser
  let name = 'Unknown';
  let version = 'Unknown';

  // Check for Edge first as it contains Chrome in UA
  if (browsers.edge.test(userAgent)) {
    name = 'Edge';
    version = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (browsers.chrome.test(userAgent)) {
    name = 'Chrome';
    version = userAgent.match(/(?:Chrome|Chromium|CriOS)\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (browsers.firefox.test(userAgent)) {
    name = 'Firefox';
    version = userAgent.match(/(?:Firefox|FxiOS)\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (browsers.safari.test(userAgent) && !browsers.chrome.test(userAgent)) {
    name = 'Safari';
    version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (browsers.opera.test(userAgent)) {
    name = 'Opera';
    version = userAgent.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (browsers.ie.test(userAgent)) {
    name = 'Internet Explorer';
    version = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)?.[1] || 'Unknown';
  }

  // Determine OS
  let operatingSystem = 'Unknown';
  if (os.windows.test(userAgent)) operatingSystem = 'Windows';
  else if (os.mac.test(userAgent)) operatingSystem = 'MacOS';
  else if (os.ios.test(userAgent)) operatingSystem = 'iOS';
  else if (os.android.test(userAgent)) operatingSystem = 'Android';
  else if (os.linux.test(userAgent)) operatingSystem = 'Linux';

  // Check if mobile
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

  // Check compatibility
  const warnings: string[] = [];
  const isCompatible = true; // Assume compatible by default

  // Log browser info
  logInfo('Browser detection', {
    name,
    version,
    os: operatingSystem,
    mobile: isMobile,
    userAgent
  });

  return {
    name,
    version,
    os: operatingSystem,
    mobile: isMobile,
    compatible: isCompatible,
    warnings
  };
}

/**
 * Check for feature support
 * @returns Object with feature support information
 */
export function checkFeatureSupport(): Record<string, boolean> {
  // Key browser features to check
  return {
    localStorage: typeof window.localStorage !== 'undefined',
    sessionStorage: typeof window.sessionStorage !== 'undefined',
    indexedDB: typeof window.indexedDB !== 'undefined',
    fetch: typeof window.fetch !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    webp: hasWebP(),
    webgl: hasWebGL(),
    canvas: hasCanvas(),
    // Ignore VR, ambient-light-sensor, and battery API checks as they trigger warnings
    // vr: 'getVRDisplays' in navigator,
    // ambientLightSensor: 'AmbientLightSensor' in window,
    // battery: 'getBattery' in navigator,
  };
}

// Helper functions for feature detection
function hasWebP(): boolean {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // was able or not to get WebP representation
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

function hasCanvas(): boolean {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
}
