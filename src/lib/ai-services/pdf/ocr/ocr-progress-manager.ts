
import { ProgressCallback } from '../types';
import { logInfo } from '@/utils/logger';

/**
 * Manages progress tracking across different OCR and PDF processing operations
 * with improved error handling and reporting
 */
export class OCRProgressManager {
  private progressCallback?: ProgressCallback;
  private progressMap: Map<string, number> = new Map();
  private weightMap: Map<string, number> = new Map();
  private totalProgress: number = 0;
  private errorCount: number = 0;
  private maxErrors: number = 3;
  private startTime: number;
  private lastReportTime: number = 0;
  private throttleInterval: number = 250; // ms
  
  constructor(
    progressCallback?: ProgressCallback,
    options?: {
      throttleInterval?: number;
      maxErrors?: number;
    }
  ) {
    this.progressCallback = progressCallback;
    this.startTime = Date.now();
    
    if (options?.throttleInterval) {
      this.throttleInterval = options.throttleInterval;
    }
    
    if (options?.maxErrors) {
      this.maxErrors = options.maxErrors;
    }
  }

  /**
   * Register a new task with weight to affect overall progress
   */
  registerTask(taskId: string, weight: number = 1): void {
    this.progressMap.set(taskId, 0);
    this.weightMap.set(taskId, weight);
    this.recalculateTotalProgress();
    
    logInfo(`OCR Progress: Task registered`, { 
      taskId, 
      weight,
      totalTasks: this.progressMap.size
    });
  }

  /**
   * Update progress for a specific task
   */
  updateTaskProgress(taskId: string, progress: number): void {
    if (!this.progressMap.has(taskId)) {
      this.registerTask(taskId);
    }
    
    // Ensure progress is between 0-100
    const boundedProgress = Math.max(0, Math.min(100, progress));
    this.progressMap.set(taskId, boundedProgress);
    this.recalculateTotalProgress();
    this.reportProgress();
  }

  /**
   * Report error for a task
   */
  reportError(taskId: string, error: any): boolean {
    this.errorCount++;
    logInfo(`OCR Progress: Error in task`, { 
      taskId, 
      errorCount: this.errorCount,
      error
    });
    
    // Return whether we should abort due to too many errors
    return this.errorCount >= this.maxErrors;
  }

  /**
   * Recalculate total progress based on weighted tasks
   */
  private recalculateTotalProgress(): void {
    let totalWeight = 0;
    let weightedProgress = 0;
    
    for (const [taskId, progress] of this.progressMap.entries()) {
      const weight = this.weightMap.get(taskId) || 1;
      totalWeight += weight;
      weightedProgress += (progress * weight);
    }
    
    this.totalProgress = totalWeight > 0 ? 
      Math.floor(weightedProgress / totalWeight) : 0;
  }

  /**
   * Report progress if callback is provided (with throttling)
   */
  private reportProgress(): void {
    if (!this.progressCallback) return;
    
    const now = Date.now();
    if (now - this.lastReportTime < this.throttleInterval) {
      return;
    }
    
    this.lastReportTime = now;
    this.progressCallback(this.totalProgress);
    
    // Log progress milestones
    if (this.totalProgress % 25 === 0 || this.totalProgress === 100) {
      const elapsedTime = (now - this.startTime) / 1000;
      logInfo(`OCR Progress: ${this.totalProgress}% complete`, { 
        totalProgress: this.totalProgress,
        elapsedTime: `${elapsedTime.toFixed(2)}s`,
        taskCount: this.progressMap.size
      });
    }
  }

  /**
   * Complete a task and mark it as 100%
   */
  completeTask(taskId: string): void {
    if (this.progressMap.has(taskId)) {
      this.progressMap.set(taskId, 100);
      this.recalculateTotalProgress();
      this.reportProgress();
      
      logInfo(`OCR Progress: Task completed`, { 
        taskId, 
        remainingTasks: this.progressMap.size - 1
      });
    }
  }

  /**
   * Get current overall progress
   */
  getProgress(): number {
    return this.totalProgress;
  }

  /**
   * Reset all progress tracking
   */
  reset(): void {
    this.progressMap.clear();
    this.weightMap.clear();
    this.totalProgress = 0;
    this.errorCount = 0;
    this.startTime = Date.now();
    this.lastReportTime = 0;
    
    if (this.progressCallback) {
      this.progressCallback(0);
    }
    
    logInfo(`OCR Progress: Reset`);
  }
}

/**
 * Create a new progress manager with throttled reporting
 */
export const createProgressManager = (
  progressCallback?: ProgressCallback,
  options?: {
    throttleInterval?: number;
    maxErrors?: number;
  }
): OCRProgressManager => {
  return new OCRProgressManager(progressCallback, options);
};
