
/**
 * Enhanced logging utility with structured logging and performance tracking
 */

// Log levels
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
  PERF = 'perf' // Performance tracking
}

// Interface for structured logs
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  duration?: number; // For performance logs
}

// Store recent logs in memory (for development)
const recentLogs: LogEntry[] = [];
const MAX_LOGS = 200; // Increased from 100 to keep more history

// Performance tracking
const performanceMarkers: Record<string, number> = {};

/**
 * Log a message with context
 */
export function log(level: LogLevel, message: string, context?: Record<string, any>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };

  // Add to recent logs and maintain maximum size
  recentLogs.push(entry);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.shift();
  }

  // Output to console with standardized format
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  
  switch (level) {
    case LogLevel.INFO:
      console.info(`[${entry.timestamp}] [INFO] ${message}${contextStr}`);
      break;
    case LogLevel.WARN:
      console.warn(`[${entry.timestamp}] [WARN] ${message}${contextStr}`);
      break;
    case LogLevel.ERROR:
      console.error(`[${entry.timestamp}] [ERROR] ${message}${contextStr}`);
      break;
    case LogLevel.DEBUG:
      console.debug(`[${entry.timestamp}] [DEBUG] ${message}${contextStr}`);
      break;
    case LogLevel.PERF:
      console.info(`[${entry.timestamp}] [PERF] ${message} - ${entry.duration}ms${contextStr}`);
      break;
  }

  // In production, you would send logs to an external service here
  // sendToLoggingService(entry);
}

// Convenience methods with standardized signatures
export const logInfo = (message: string, context?: Record<string, any>) => log(LogLevel.INFO, message, context);
export const logWarn = (message: string, context?: Record<string, any>) => log(LogLevel.WARN, message, context);
export const logError = (message: string, context?: Record<string, any>) => log(LogLevel.ERROR, message, context);
export const logDebug = (message: string, context?: Record<string, any>) => log(LogLevel.DEBUG, message, context);

/**
 * Start timing an operation for performance tracking
 * @param markerId Unique identifier for this timing operation
 */
export function startPerformanceTimer(markerId: string): void {
  performanceMarkers[markerId] = performance.now();
}

/**
 * End timing an operation and log the result
 * @param markerId Unique identifier that was used with startPerformanceTimer
 * @param operationName Description of the operation that was timed
 * @param context Additional context to log
 */
export function endPerformanceTimer(markerId: string, operationName: string, context?: Record<string, any>): number {
  if (!performanceMarkers[markerId]) {
    logWarn(`Performance timer "${markerId}" was never started`, { operationName });
    return 0;
  }
  
  const startTime = performanceMarkers[markerId];
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Clean up the marker
  delete performanceMarkers[markerId];
  
  // Log the performance information
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: LogLevel.PERF,
    message: operationName,
    context,
    duration
  };
  
  // Add to recent logs
  recentLogs.push(entry);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.shift();
  }
  
  console.info(`[${entry.timestamp}] [PERF] ${operationName} - ${duration.toFixed(2)}ms${context ? ` ${JSON.stringify(context)}` : ''}`);
  
  return duration;
}

/**
 * Get recent logs (useful for debugging)
 */
export function getRecentLogs(): LogEntry[] {
  return [...recentLogs];
}

/**
 * Clear recent logs
 */
export function clearLogs(): void {
  recentLogs.length = 0;
}

/**
 * Initialize dev error handler (for local development)
 */
export function initLogging(): void {
  logInfo('Logging system initialized', { timestamp: new Date().toISOString() });
  
  // Set up global error handling
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      logError('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      logError('Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }
}

// Automatically initialize logging when imported
initLogging();
