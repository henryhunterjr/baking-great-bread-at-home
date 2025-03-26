
/**
 * Simple logging utility to help with error tracking
 * This could be expanded to integrate with external logging services
 */

// Log levels
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

// Interface for structured logs
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

// Store recent logs in memory (for development)
const recentLogs: LogEntry[] = [];
const MAX_LOGS = 100;

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
}
