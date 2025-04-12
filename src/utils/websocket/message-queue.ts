
import { logInfo } from '../logger';
import { MessageQueueItem } from './types';

/**
 * Manages queuing and sending of WebSocket messages
 */
export class MessageQueue {
  private pendingMessages: Array<MessageQueueItem> = [];
  private maxQueueSize = 100;
  private maxRetryAttempts = 3;

  /**
   * Queue a message for sending
   */
  queueMessage(data: any): MessageQueueItem {
    const message: MessageQueueItem = {
      data,
      timestamp: Date.now(),
      attempts: 0
    };

    // Prevent queue from growing too large
    if (this.pendingMessages.length >= this.maxQueueSize) {
      // Remove oldest message
      this.pendingMessages.shift();
    }

    this.pendingMessages.push(message);
    return message;
  }

  /**
   * Get all pending messages
   */
  getPendingMessages(): Array<MessageQueueItem> {
    return [...this.pendingMessages];
  }

  /**
   * Clear all pending messages
   */
  clearPendingMessages(): void {
    this.pendingMessages = [];
  }

  /**
   * Remove a message from the queue
   */
  removeMessage(message: MessageQueueItem): void {
    const index = this.pendingMessages.indexOf(message);
    if (index !== -1) {
      this.pendingMessages.splice(index, 1);
    }
  }

  /**
   * Increment attempt count for a message
   */
  incrementAttempt(message: MessageQueueItem): boolean {
    message.attempts++;
    return message.attempts <= this.maxRetryAttempts;
  }

  /**
   * Check if queue has pending messages
   */
  hasPendingMessages(): boolean {
    return this.pendingMessages.length > 0;
  }

  /**
   * Get queue status for logging
   */
  getQueueStatus(): { size: number, oldest: number | null } {
    if (this.pendingMessages.length === 0) {
      return { size: 0, oldest: null };
    }
    
    const oldest = Math.min(...this.pendingMessages.map(m => m.timestamp));
    return {
      size: this.pendingMessages.length,
      oldest: oldest ? Date.now() - oldest : null
    };
  }
}
