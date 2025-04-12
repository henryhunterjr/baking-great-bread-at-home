
/**
 * WebSocket Manager Types
 */

export interface MessageQueueItem {
  data: any;
  timestamp: number;
  attempts: number;
}

export interface ConnectionOptions {
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  timeout?: number;
  disableWebSockets?: boolean;
}

export interface WebSocketManagerInterface {
  connect(): Promise<boolean>;
  send(data: any): Promise<boolean>;
  onMessage(callback: (data: any) => void): WebSocketManagerInterface;
  onConnect(callback: () => void): WebSocketManagerInterface;
  onError(callback: (error: any) => void): WebSocketManagerInterface;
  isFallbackMode(): boolean;
  close(): void;
}
