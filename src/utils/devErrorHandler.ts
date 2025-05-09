
import { logDebug } from './logger';

/**
 * Utility to handle and suppress common development environment errors
 * that don't affect application functionality
 */

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/**
 * Initialize the development error handler
 * This will filter out common development-related errors from the console
 */
export function initDevErrorHandler(suppressErrors = true): void {
  if (!suppressErrors) return;

  // Known patterns to suppress
  const suppressPatterns = [
    /WebSocket connection/i,
    /Access to fetch.*has been blocked by CORS policy/i,
    /Failed to load resource: net::ERR_FAILED/i,
    /Max reconnect attempts/i,
    /Unrecognized feature:/i,
    /The resource .* was preloaded using link preload but not used/i,
    /Tracking Prevention blocked access to storage/i,
    /https:\/\/id-preview-.*lovable\.app\//i,
    /Failed to load resource: the server responded with a status of 500/i,
    /Chrome is moving towards a new experience that allows users to choose to browse without third-party cookies/i,
    /Microsoft Edge is moving towards a new experience that allows users to choose to browse without third-party cookies/i,
    /wss:\/\//i,
    /Unexpected response code: 404/i,
    /Unexpected response code: 412/i,
    /Error during WebSocket handshake/i,
    /React does not recognize the `fetchPriority` prop/i
  ];

  // Override console.error
  console.error = (...args) => {
    // Check if this is a development-related error we want to suppress
    const errorString = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(errorString));
    
    if (shouldSuppress) {
      // Log to debug channel instead of error
      logDebug('Suppressed development error', { message: errorString });
      return;
    }
    
    // Pass through to original console.error
    originalConsoleError.apply(console, args);
  };

  // Override console.warn
  console.warn = (...args) => {
    // Check if this is a development-related warning we want to suppress
    const warnString = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(warnString));
    
    if (shouldSuppress) {
      // Log to debug channel instead of warn
      logDebug('Suppressed development warning', { message: warnString });
      return;
    }
    
    // Pass through to original console.warn
    originalConsoleWarn.apply(console, args);
  };

  logDebug('Development error handler initialized');
}

/**
 * Restore original console methods
 */
export function restoreConsole(): void {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  logDebug('Console methods restored');
}

/**
 * Check if we're in a development environment
 */
export function isDevelopmentEnvironment(): boolean {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname.includes('lovableproject.com');
}
