
import { logInfo, logError, logWarn } from './logger';

/**
 * Handles WebSocket connections with fallback options
 */
export class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: number | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;
  private useFallback = false;
  private shouldDisableWebSocket = false;

  constructor(url: string) {
    this.url = url;
    
    // Always disable WebSockets in production or preview environments
    // Using environment check and window location check
    if (typeof window !== 'undefined') {
      const isPreviewOrProduction = !window.location.hostname.includes('localhost');
      this.shouldDisableWebSocket = isPreviewOrProduction;
      
      if (this.shouldDisableWebSocket) {
        this.useFallback = true;
        logInfo('WebSocket disabled in production/preview environment - using fallback mode');
      }
    } else {
      this.useFallback = true;
    }
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): void {
    // Skip connection if WebSocket is disabled
    if (this.shouldDisableWebSocket) {
      this.useFallback = true;
      if (this.onConnectCallback) this.onConnectCallback();
      logInfo('WebSocket connection skipped, using fallback mode');
      return;
    }
    
    // If we've reached max reconnect attempts, use fallback
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logWarn('WebSocket max reconnect attempts reached, using fallback mode');
      this.useFallback = true;
      if (this.onConnectCallback) this.onConnectCallback();
      return;
    }

    try {
      logInfo('Attempting WebSocket connection', { url: this.url, attempt: this.reconnectAttempts + 1 });
      
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        logInfo('WebSocket connection established');
        this.reconnectAttempts = 0;
        if (this.onConnectCallback) this.onConnectCallback();
      };
      
      this.socket.onmessage = (event) => {
        if (this.onMessageCallback) {
          try {
            const data = JSON.parse(event.data);
            this.onMessageCallback(data);
          } catch (error) {
            this.onMessageCallback(event.data);
          }
        }
      };
      
      this.socket.onerror = (error) => {
        logError('WebSocket connection error', { error });
        if (this.onErrorCallback) this.onErrorCallback(error);
        
        // Immediately set to fallback mode in production environments
        if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
          this.useFallback = true;
          logInfo('WebSocket error in production - switching to fallback mode');
        }
      };
      
      this.socket.onclose = (event) => {
        logWarn('WebSocket connection closed', { code: event.code, reason: event.reason });
        
        // In production, immediately go to fallback mode instead of retrying
        if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
          this.useFallback = true;
          if (this.onConnectCallback) this.onConnectCallback();
          logInfo('WebSocket closed in production - switching to fallback mode');
          return;
        }
        
        // If normal closure, don't attempt to reconnect
        if (event.code === 1000) return;
        
        // Attempt to reconnect in development only
        this.reconnect();
      };
    } catch (error) {
      logError('WebSocket connection attempt failed', { error });
      this.reconnect();
    }
  }

  /**
   * Attempt to reconnect
   */
  private reconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000);
      
      logInfo('Scheduling WebSocket reconnect', { 
        attempt: this.reconnectAttempts, 
        maxAttempts: this.maxReconnectAttempts,
        delay
      });
      
      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      logWarn('WebSocket max reconnect attempts reached, using fallback mode');
      this.useFallback = true;
      if (this.onConnectCallback) this.onConnectCallback();
    }
  }

  /**
   * Send data through WebSocket or fallback
   */
  send(data: any): boolean {
    // Always use fallback in production
    if (this.useFallback || (typeof window !== 'undefined' && !window.location.hostname.includes('localhost'))) {
      logInfo('Using fallback mode for sending message');
      // Implement REST API fallback
      return true;
    }
    
    // If socket isn't connected, queue the message or return false
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      logWarn('WebSocket not connected, cannot send message');
      return false;
    }
    
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket.send(message);
      return true;
    } catch (error) {
      logError('Error sending message over WebSocket', { error });
      return false;
    }
  }

  /**
   * Set message handler
   */
  onMessage(callback: (data: any) => void): this {
    this.onMessageCallback = callback;
    return this;
  }

  /**
   * Set connection handler
   */
  onConnect(callback: () => void): this {
    this.onConnectCallback = callback;
    return this;
  }

  /**
   * Set error handler
   */
  onError(callback: (error: any) => void): this {
    this.onErrorCallback = callback;
    return this;
  }

  /**
   * Check if using fallback mode
   */
  isFallbackMode(): boolean {
    return this.useFallback;
  }

  /**
   * Close the connection
   */
  close(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.reconnectAttempts = 0;
    this.useFallback = false;
  }
}

/**
 * Create a WebSocket manager with fallback capabilities
 */
export const createWebSocketManager = (url: string): WebSocketManager => {
  return new WebSocketManager(url);
};
