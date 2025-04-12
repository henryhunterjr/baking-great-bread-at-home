
import { logInfo, logError, logWarn } from '../logger';
import { ConnectionOptions } from './types';

/**
 * Handles WebSocket connections with lifecycle management
 */
export class ConnectionHandler {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectTimeout: number | null = null;
  private connectionPromise: Promise<boolean> | null = null;
  private connectionResolver: ((success: boolean) => void) | null = null;
  private useFallback = false;
  private shouldDisableWebSocket = true; // Changed to true by default
  
  // Callback handlers
  private onMessageCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;
  
  constructor(url: string, options?: ConnectionOptions) {
    this.url = url;
    this.maxReconnectAttempts = options?.maxReconnectAttempts || 3;
    
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
   * Get the current socket instance
   */
  getSocket(): WebSocket | null {
    return this.socket;
  }

  /**
   * Set callback handlers
   */
  setCallbacks(
    messageCallback: ((data: any) => void) | null,
    connectCallback: (() => void) | null,
    errorCallback: ((error: any) => void) | null
  ): void {
    this.onMessageCallback = messageCallback;
    this.onConnectCallback = connectCallback;
    this.onErrorCallback = errorCallback;
  }

  /**
   * Connect to the WebSocket server
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
  reconnect(): void {
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
   * Send data directly through WebSocket
   */
  sendDirectly(data: any): boolean {
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
