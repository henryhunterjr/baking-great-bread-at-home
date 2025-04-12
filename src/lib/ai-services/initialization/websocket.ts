
import { logInfo } from '@/utils/logger';
import { createWebSocketManager } from '@/utils/websocket';

// WebSocket connection if needed
let websocketManager: ReturnType<typeof createWebSocketManager> | null = null;

/**
 * Initialize WebSocket connections
 * 
 * WebSocket connections are disabled in production to avoid CORS/connection issues
 */
export const initializeWebSockets = (): void => {
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    logInfo('WebSocket initialization skipped in production - using fallback mode');
  }
};

/**
 * Get WebSocket manager instance
 */
export const getWebSocketManager = (): ReturnType<typeof createWebSocketManager> | null => {
  return websocketManager;
};
