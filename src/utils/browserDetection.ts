
/**
 * Browser detection and compatibility testing utilities
 */

export interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
  compatible: boolean;
  warnings: string[];
}

/**
 * Detect current browser information
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const browserInfo: BrowserInfo = {
    name: 'unknown',
    version: 'unknown',
    os: 'unknown',
    mobile: false,
    compatible: true,
    warnings: []
  };

  // Detect browser
  if (ua.indexOf('Firefox') > -1) {
    browserInfo.name = 'Firefox';
    browserInfo.version = ua.match(/Firefox\/([0-9.]+)/)![1];
  } else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
    browserInfo.name = 'Edge';
    browserInfo.version = ua.match(/Edge\/([0-9.]+)/) 
      ? ua.match(/Edge\/([0-9.]+)/)![1] 
      : ua.match(/Edg\/([0-9.]+)/)![1];
  } else if (ua.indexOf('Chrome') > -1) {
    browserInfo.name = 'Chrome';
    browserInfo.version = ua.match(/Chrome\/([0-9.]+)/)![1];
  } else if (ua.indexOf('Safari') > -1) {
    browserInfo.name = 'Safari';
    browserInfo.version = ua.match(/Version\/([0-9.]+)/)![1];
  } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
    browserInfo.name = 'Internet Explorer';
    browserInfo.version = ua.indexOf('MSIE') > -1 
      ? ua.match(/MSIE ([0-9.]+)/)![1] 
      : '11.0';
    browserInfo.compatible = false;
    browserInfo.warnings.push('Internet Explorer is not fully supported. Please use Chrome, Firefox, Safari, or Edge.');
  }

  // Detect OS
  if (ua.indexOf('Windows') > -1) {
    browserInfo.os = 'Windows';
  } else if (ua.indexOf('Mac') > -1) {
    browserInfo.os = 'macOS';
  } else if (ua.indexOf('Linux') > -1) {
    browserInfo.os = 'Linux';
  } else if (ua.indexOf('Android') > -1) {
    browserInfo.os = 'Android';
    browserInfo.mobile = true;
  } else if (ua.indexOf('iOS') > -1 || (ua.indexOf('iPhone') > -1) || (ua.indexOf('iPad') > -1)) {
    browserInfo.os = 'iOS';
    browserInfo.mobile = true;
  }

  // Check for known compatibility issues
  if (browserInfo.name === 'Safari' && parseInt(browserInfo.version) < 14) {
    browserInfo.warnings.push('You are using an older version of Safari. Some features may not work correctly.');
  }

  if (browserInfo.mobile && browserInfo.name === 'Chrome' && parseInt(browserInfo.version) < 80) {
    browserInfo.warnings.push('You are using an older version of Chrome. Please update for the best experience.');
  }

  return browserInfo;
}

/**
 * Check for specific browser features
 */
export function checkFeatureSupport(): Record<string, boolean> {
  return {
    webp: testWebP(),
    grid: CSS.supports('display', 'grid'),
    flexbox: CSS.supports('display', 'flex'),
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    webAnimation: 'animate' in Element.prototype,
    inlineVideo: browserCanInlineVideo()
  };
}

/**
 * Test WebP support
 */
function testWebP(): boolean {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Test inline video support (important for iOS)
 */
function browserCanInlineVideo(): boolean {
  const video = document.createElement('video');
  return 'playsInline' in video;
}

/**
 * Log any compatibility warnings
 */
export function logCompatibilityWarnings(): void {
  const browserInfo = detectBrowser();
  const featureSupport = checkFeatureSupport();
  
  if (!browserInfo.compatible || browserInfo.warnings.length > 0) {
    console.warn('Browser compatibility warnings:', browserInfo.warnings);
  }
  
  if (!featureSupport.webp) {
    console.warn('WebP image format not supported in this browser. Falling back to JPG/PNG.');
  }
  
  return;
}
