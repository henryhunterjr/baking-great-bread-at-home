
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
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  duration?: number; // For performance logs
}

// Store recent logs in memory (for development)
const recentLogs: LogEntry[] = [];
const MAX_LOGS = 200;

// Performance tracking
const performanceMarkers: Record<string, number> = {};

/**
 * Start performance timing for an operation
 */
export function startPerformanceTimer(markerId: string): void {
  performanceMarkers[markerId] = Date.now();
}

/**
 * End performance timing and log the result
 */
export function endPerformanceTimer(
  markerId: string, 
  operation: string,
  context?: Record<string, any>
): number {
  const startTime = performanceMarkers[markerId];
  if (!startTime) {
    logWarn(`Performance marker ${markerId} not found`);
    return 0;
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Log performance data
  const entry: LogEntry = {
    timestamp: endTime,
    level: LogLevel.PERF,
    message: `${operation} completed in ${duration}ms`,
    context,
    duration
  };
  
  // Add to recent logs
  recentLogs.push(entry);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.shift();
  }
  
  console.info(
    `[${entry.timestamp}] [PERF] ${entry.message}${context ? ' ' + JSON.stringify(context) : ''}`
  );
  
  // Clean up
  delete performanceMarkers[markerId];
  
  return duration;
}

/**
 * Log a message with context
 */
export function log(level: LogLevel, message: string, context?: Record<string, any>): void {
  const entry: LogEntry = {
    timestamp: Date.now(),
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
}

// Convenience methods with standardized signatures
export const logInfo = (message: string, context?: Record<string, any>) => log(LogLevel.INFO, message, context);
export const logWarn = (message: string, context?: Record<string, any>) => log(LogLevel.WARN, message, context);
export const logError = (message: string, context?: Record<string, any>) => log(LogLevel.ERROR, message, context);
export const logDebug = (message: string, context?: Record<string, any>) => log(LogLevel.DEBUG, message, context);

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
 * Initialize logging system
 */
export function initLogging(): void {
  logInfo('Logging system initialized', { timestamp: Date.now() });
}

// Initialize logging when imported
initLogging();
