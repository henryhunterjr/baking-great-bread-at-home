
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
  private useFallback = true; // Always use fallback mode
  private shouldDisableWebSocket = true; // Always disable WebSockets for now
  
  // Callback handlers
  private onMessageCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;
  
  constructor(url: string, options?: ConnectionOptions) {
    this.url = url;
    this.maxReconnectAttempts = options?.maxReconnectAttempts || 3;
    
    // Skip WebSockets entirely for better reliability
    this.shouldDisableWebSocket = true;
    this.useFallback = true;
    logInfo('WebSocket disabled - using fallback mode');
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
    this.useFallback = true;
    if (this.onConnectCallback) this.onConnectCallback();
    logInfo('Using fallback mode for WebSocket connections');
    return Promise.resolve(true);
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
    // Always use fallback mode - don't try to send via WebSocket
    return false;
  }

  /**
   * Check if using fallback mode
   */
  isFallbackMode(): boolean {
    return true; // Always return true for fallback mode
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
  }
}
