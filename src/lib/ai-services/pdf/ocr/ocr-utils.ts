
import { ProgressCallback } from '../types';
import { logInfo } from '@/utils/logger';

/**
 * Creates a throttled progress reporter function to reduce update frequency
 * 
 * @param callback The original progress callback function
 * @param throttleMs Milliseconds to throttle between updates (default: 200ms)
 * @returns A throttled version of the progress callback
 */
export const createThrottledProgressReporter = (
  callback: ProgressCallback,
  throttleMs = 200
): ProgressCallback => {
  let lastUpdateTime = 0;
  let lastProgress = -1;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Update if:
    // 1. Enough time has passed since the last update, OR
    // 2. This is a significant progress change (more than 5%), OR
    // 3. This is the first (0%) or last (100%) update
    if (
      now - lastUpdateTime > throttleMs ||
      Math.abs(progress - lastProgress) > 5 ||
      progress === 0 ||
      progress === 100
    ) {
      lastUpdateTime = now;
      lastProgress = progress;
      callback(progress);
      
      // Log progress updates but only for significant changes
      if (progress % 10 === 0 || progress === 100) {
        logInfo('OCR progress update', { progress: `${progress}%` });
      }
    }
  };
};

/**
 * Estimates the time required for OCR processing based on file size
 * 
 * @param fileSize Size of the file in bytes
 * @returns Estimated processing time in milliseconds
 */
export const estimateOCRProcessingTime = (fileSize: number): number => {
  // Base processing time (3 seconds) + additional time based on file size
  // These values can be adjusted based on real-world performance data
  const baseTime = 3000;
  const sizeMultiplier = 0.002; // ms per byte
  
  return baseTime + (fileSize * sizeMultiplier);
};

/**
 * Calculates appropriate timeout based on file size and complexity
 * 
 * @param fileSize Size of the file in bytes
 * @param isComplex Whether the file is expected to be complex
 * @returns Timeout value in milliseconds
 */
export const calculateTimeout = (fileSize: number, isComplex = false): number => {
  // Base timeout of 30 seconds
  let timeout = 30000;
  
  // Add 10ms per KB of file size
  timeout += Math.floor(fileSize / 1024) * 10;
  
  // For complex files (like images with lots of text or PDFs with many pages)
  if (isComplex) {
    timeout *= 2;
  }
  
  // Cap at 5 minutes (300000ms) for browser processing
  return Math.min(timeout, 300000);
};

/**
 * Estimates memory usage for OCR processing based on image dimensions
 * 
 * @param width Image width in pixels
 * @param height Image height in pixels
 * @returns Estimated memory usage in MB
 */
export const estimateMemoryUsage = (width: number, height: number): number => {
  // Basic estimate: 4 bytes per pixel (RGBA) + overhead
  const pixelCount = width * height;
  const bytesPerPixel = 4;
  const overhead = 1.5; // 50% overhead for processing
  
  // Calculate in MB
  return (pixelCount * bytesPerPixel * overhead) / (1024 * 1024);
};

/**
 * Checks if the current environment has sufficient memory for OCR processing
 * 
 * @param requiredMemoryMB Estimated memory required in MB
 * @returns Boolean indicating if memory is sufficient
 */
export const hasEnoughMemory = (requiredMemoryMB: number): boolean => {
  // Check if performance.memory is available (Chrome only)
  if (window.performance && 'memory' in window.performance) {
    const memory = (window.performance as any).memory;
    
    if (memory && memory.jsHeapSizeLimit) {
      const availableMemoryMB = memory.jsHeapSizeLimit / (1024 * 1024);
      const usedMemoryMB = memory.usedJSHeapSize / (1024 * 1024);
      const remainingMemoryMB = availableMemoryMB - usedMemoryMB;
      
      logInfo('Memory check', {
        availableMemoryMB: Math.round(availableMemoryMB),
        usedMemoryMB: Math.round(usedMemoryMB),
        remainingMemoryMB: Math.round(remainingMemoryMB),
        requiredMemoryMB: Math.round(requiredMemoryMB)
      });
      
      // Need at least the required memory + 50MB buffer
      return remainingMemoryMB > (requiredMemoryMB + 50);
    }
  }
  
  // If we can't check memory, assume it's sufficient
  // Most modern browsers have enough memory for reasonable-sized images
  return true;
};
