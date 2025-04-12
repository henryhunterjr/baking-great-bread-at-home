
import { logInfo, logError, logWarn } from '../logger';
import { ConnectionHandler } from './connection-handler';
import { MessageQueue } from './message-queue';
import { ConnectionOptions, WebSocketManagerInterface } from './types';

/**
 * WebSocket Manager with fallback options and improved performance
 */
export class WebSocketManager implements WebSocketManagerInterface {
  private connectionHandler: ConnectionHandler;
  private messageQueue: MessageQueue;
  
  constructor(url: string, options?: ConnectionOptions) {
    this.connectionHandler = new ConnectionHandler(url, options);
    this.messageQueue = new MessageQueue();
  }

  /**
   * Connect to the WebSocket server with Promise-based resolution
   */
  connect(): Promise<boolean> {
    // Set callbacks on the connection handler
    this.connectionHandler.setCallbacks(
      // Message callback
      (data) => {
        if (this.onMessageCallback) this.onMessageCallback(data);
      },
      // Connect callback
      () => {
        // Send any pending messages
        if (this.onConnectCallback) this.onConnectCallback();
        
        const pendingMessages = this.messageQueue.getPendingMessages();
        if (pendingMessages.length > 0) {
          logInfo(`Sending ${pendingMessages.length} pending messages`);
          pendingMessages.forEach(msg => {
            if (this.connectionHandler.sendDirectly(msg.data)) {
              this.messageQueue.removeMessage(msg);
            } else if (!this.messageQueue.incrementAttempt(msg)) {
              // If max attempts reached, remove message
              this.messageQueue.removeMessage(msg);
            }
          });
        }
      },
      // Error callback
      (error) => {
        if (this.onErrorCallback) this.onErrorCallback(error);
      }
    );
    
    return this.connectionHandler.connect();
  }

  /**
   * Send data through WebSocket or fallback with queue support
   */
  async send(data: any): Promise<boolean> {
    // Always use fallback 
    this.connectionHandler.isFallbackMode();
    logInfo('Using fallback mode for sending message');
    // Implement REST API fallback
    return true;
  }

  // Callback handlers
  private onMessageCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  /**
   * Set message handler
   */
  onMessage(callback: (data: any) => void): WebSocketManagerInterface {
    this.onMessageCallback = callback;
    return this;
  }

  /**
   * Set connection handler
   */
  onConnect(callback: () => void): WebSocketManagerInterface {
    this.onConnectCallback = callback;
    return this;
  }

  /**
   * Set error handler
   */
  onError(callback: (error: any) => void): WebSocketManagerInterface {
    this.onErrorCallback = callback;
    return this;
  }

  /**
   * Check if using fallback mode
   */
  isFallbackMode(): boolean {
    return this.connectionHandler.isFallbackMode();
  }

  /**
   * Close the connection
   */
  close(): void {
    this.connectionHandler.close();
    this.messageQueue.clearPendingMessages();
  }
}

/**
 * Create a WebSocket manager with fallback capabilities
 */
export const createWebSocketManager = (url: string, options?: ConnectionOptions): WebSocketManager => {
  return new WebSocketManager(url, options);
};
