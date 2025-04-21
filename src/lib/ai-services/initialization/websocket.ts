
import { logInfo } from '@/utils/logger';
import { createWebSocketManager } from '@/utils/websocket';

// WebSocket connection if needed
let websocketManager: ReturnType<typeof createWebSocketManager> | null = null;

/**
 * Initialize WebSocket connections
 * 
 * WebSocket connections are disabled in production and development to avoid CORS/connection issues
 */
export const initializeWebSockets = (): void => {
  logInfo('WebSocket initialization skipped - using fallback mode');
  // We're explicitly not initializing websockets to avoid connection errors
};

/**
 * Get WebSocket manager instance
 */
export const getWebSocketManager = (): ReturnType<typeof createWebSocketManager> | null => {
  return null; // Always return null to disable websocket usage
};
