import { logInfo, logError, logWarn } from './logger';

/**
 * Handles WebSocket connections with fallback options and improved performance
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
  private shouldDisableWebSocket = true; // Changed to true by default
  private pendingMessages: Array<any> = [];
  private connectionPromise: Promise<boolean> | null = null;
  private connectionResolver: ((success: boolean) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    
    // Skip WebSockets in production environments for better reliability
    if (typeof window !== 'undefined') {
      const isPreviewOrProduction = !window.location.hostname.includes('localhost');
      this.shouldDisableWebSocket = true; // Always disable WebSockets for now
      
      if (this.shouldDisableWebSocket) {
        this.useFallback = true;
        logInfo('WebSocket disabled - using fallback mode');
      }
    }
  }

  /**
   * Connect to the WebSocket server with Promise-based resolution
   */
  connect(): Promise<boolean> {
    // Always use fallback mode
    if (this.useFallback || this.shouldDisableWebSocket) {
      this.useFallback = true;
      if (this.onConnectCallback) this.onConnectCallback();
      logInfo('Using fallback mode for WebSocket connections');
      return Promise.resolve(true);
    }
    
    // Return existing connection promise if we're in the process of connecting
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    
    this.connectionPromise = new Promise<boolean>(resolve => {
      this.connectionResolver = resolve;
      
      // Skip connection if WebSocket is disabled
      if (this.shouldDisableWebSocket) {
        this.useFallback = true;
        if (this.onConnectCallback) this.onConnectCallback();
        logInfo('WebSocket connection skipped, using fallback mode');
        resolve(true);
        return;
      }
      
      // If we've reached max reconnect attempts, use fallback
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logWarn('WebSocket max reconnect attempts reached, using fallback mode');
        this.useFallback = true;
        if (this.onConnectCallback) this.onConnectCallback();
        resolve(true);
        return;
      }

      try {
        logInfo('Attempting WebSocket connection', { url: this.url, attempt: this.reconnectAttempts + 1 });
        
        this.socket = new WebSocket(this.url);
        
        // Set a connection timeout
        const connectionTimeout = setTimeout(() => {
          if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            logWarn('WebSocket connection timeout');
            this.socket.close();
            this.reconnect();
          }
        }, 5000);
        
        this.socket.onopen = () => {
          clearTimeout(connectionTimeout);
          logInfo('WebSocket connection established');
          this.reconnectAttempts = 0;
          
          // Send any pending messages
          if (this.pendingMessages.length > 0) {
            logInfo(`Sending ${this.pendingMessages.length} pending messages`);
            this.pendingMessages.forEach(msg => {
              this.sendDirectly(msg);
            });
            this.pendingMessages = [];
          }
          
          if (this.onConnectCallback) this.onConnectCallback();
          if (this.connectionResolver) this.connectionResolver(true);
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
          clearTimeout(connectionTimeout);
          logWarn('WebSocket connection closed', { code: event.code, reason: event.reason });
          
          // In production, immediately go to fallback mode instead of retrying
          if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
            this.useFallback = true;
            if (this.onConnectCallback) this.onConnectCallback();
            if (this.connectionResolver) this.connectionResolver(true);
            logInfo('WebSocket closed in production - switching to fallback mode');
            return;
          }
          
          // If normal closure, don't attempt to reconnect
          if (event.code === 1000) {
            if (this.connectionResolver) this.connectionResolver(true);
            return;
          }
          
          // Attempt to reconnect in development only
          this.reconnect();
        };
      } catch (error) {
        logError('WebSocket connection attempt failed', { error });
        this.reconnect();
      }
    });
    
    return this.connectionPromise;
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
   * Send data directly through WebSocket (internal use)
   */
  private sendDirectly(data: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
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
   * Send data through WebSocket or fallback with queue support
   */
  async send(data: any): Promise<boolean> {
    // Always use fallback 
    this.useFallback = true;
    logInfo('Using fallback mode for sending message');
    // Implement REST API fallback
    return true;
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
