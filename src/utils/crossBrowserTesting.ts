
import { detectBrowser, checkFeatureSupport } from './browserDetection';
import { logInfo, logWarn, logError } from './logger';

/**
 * Simple browser feature test to identify potential compatibility issues
 */
export function runBrowserCompatibilityCheck(): {
  compatible: boolean;
  warnings: string[];
  features: Record<string, boolean>;
} {
  try {
    // Get browser info
    const browserInfo = detectBrowser();
    
    // Check for feature support
    const featureSupport = checkFeatureSupport();
    
    // Log browser info
    logInfo('Browser compatibility check', {
      browser: browserInfo.name,
      version: browserInfo.version,
      os: browserInfo.os,
      mobile: browserInfo.mobile,
      features: featureSupport
    });
    
    // Log any warnings
    if (browserInfo.warnings.length > 0) {
      logWarn('Browser compatibility warnings', {
        warnings: browserInfo.warnings
      });
    }
    
    return {
      compatible: browserInfo.compatible,
      warnings: browserInfo.warnings,
      features: featureSupport
    };
  } catch (error) {
    logError('Error running browser compatibility check', { error });
    return {
      compatible: true, // Assume compatible to not block users
      warnings: ['Could not check browser compatibility'],
      features: {}
    };
  }
}

/**
 * Check viewport size and orientation for responsive testing
 */
export function checkViewport(): {
  width: number;
  height: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
} {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = window.devicePixelRatio || 1;
  
  // Determine size category (matches Tailwind breakpoints)
  let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  if (width < 640) size = 'xs';
  else if (width < 768) size = 'sm';
  else if (width < 1024) size = 'md';
  else if (width < 1280) size = 'lg';
  else if (width < 1536) size = 'xl';
  else size = '2xl';
  
  const orientation = width >= height ? 'landscape' : 'portrait';
  
  return {
    width,
    height,
    devicePixelRatio: ratio,
    orientation,
    size
  };
}

/**
 * Load testing utility to simulate different network conditions
 * This is just a simulation for development purposes
 */
export function simulateNetworkCondition(condition: 'fast' | 'average' | 'slow' | '3g'): void {
  let delay: number;
  
  switch (condition) {
    case 'fast':
      delay = 50;
      break;
    case 'average':
      delay = 200;
      break;
    case 'slow':
      delay = 1000;
      break;
    case '3g':
      delay = 2000;
      break;
    default:
      delay = 0;
  }
  
  // Override fetch and setTimeout (for development only)
  const originalFetch = window.fetch;
  const originalSetTimeout = window.setTimeout;
  
  window.fetch = async (...args) => {
    await new Promise(resolve => originalSetTimeout(resolve, delay));
    return originalFetch(...args);
  };
  
  logInfo(`Network condition simulation: ${condition}`, { delay: `${delay}ms` });
  
  // Use type-safe approach with nullish check before assignment
  if (typeof window !== 'undefined') {
    // Safely assign the resetNetworkSimulation function
    window.resetNetworkSimulation = () => {
      window.fetch = originalFetch;
      logInfo('Network simulation reset');
    };
  }
}

/**
 * Run a basic performance check
 */
export async function checkPerformance(): Promise<{
  loadTime: number;
  firstPaint: number;
  domInteractive: number;
}> {
  // Note: This requires the navigation timing API
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const firstPaint = timing.responseStart - timing.navigationStart;
    const domInteractive = timing.domInteractive - timing.navigationStart;
    
    logInfo('Page performance metrics', {
      loadTime: `${loadTime}ms`,
      firstPaint: `${firstPaint}ms`,
      domInteractive: `${domInteractive}ms`
    });
    
    return { loadTime, firstPaint, domInteractive };
  }
  
  return { loadTime: 0, firstPaint: 0, domInteractive: 0 };
}
