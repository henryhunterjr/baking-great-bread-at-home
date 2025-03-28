
import { ProgressCallback } from '../types';

/**
 * Create a throttled progress reporter to avoid excessive updates
 * @param callback The original progress callback
 * @param throttleMs Minimum time between callbacks (ms)
 * @returns A throttled callback function
 */
export const createThrottledProgressReporter = (
  callback: ProgressCallback,
  throttleMs: number = 250
): ProgressCallback => {
  let lastCallTime = 0;
  let lastProgress = 0;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Always report 0% and 100% immediately
    if (progress === 0 || progress === 1 || progress >= 0.99) {
      lastCallTime = now;
      lastProgress = progress;
      callback(progress);
      return;
    }
    
    // Throttle other updates
    if (
      now - lastCallTime >= throttleMs || 
      Math.abs(progress - lastProgress) >= 0.1  // Also update if progress jumps by 10% or more
    ) {
      lastCallTime = now;
      lastProgress = progress;
      callback(progress);
    }
  };
};

/**
 * Create a progress mapper that transforms progress from one range to another
 * @param fromMin Minimum input value
 * @param fromMax Maximum input value
 * @param toMin Minimum output value 
 * @param toMax Maximum output value
 * @returns A function that maps progress values
 */
export const createProgressMapper = (
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): ((progress: number) => number) => {
  return (progress: number) => {
    // Clamp input to range
    const clampedProgress = Math.max(fromMin, Math.min(fromMax, progress));
    
    // Map from input range to output range
    return toMin + (clampedProgress - fromMin) * (toMax - toMin) / (fromMax - fromMin);
  };
};

/**
 * Create a progress reporter that combines multiple stages with different weights
 * @param callback The parent progress callback
 * @param stages Array of stage configurations with weights
 * @returns An object with methods to update progress for specific stages
 */
export const createMultiStageProgressReporter = (
  callback: ProgressCallback,
  stages: { id: string; weight: number }[]
): {
  updateStageProgress: (stageId: string, progress: number) => void;
} => {
  // Calculate total weight
  const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0);
  
  // Initialize progress for each stage
  const progressByStage: Record<string, number> = {};
  stages.forEach(stage => { progressByStage[stage.id] = 0; });
  
  // Function to update stage progress and recalculate overall progress
  const updateStageProgress = (stageId: string, progress: number) => {
    if (!(stageId in progressByStage)) {
      console.warn(`Unknown stage ID: ${stageId}`);
      return;
    }
    
    // Update the stage progress
    progressByStage[stageId] = Math.max(0, Math.min(1, progress));
    
    // Calculate weighted overall progress
    let overallProgress = 0;
    stages.forEach(stage => {
      overallProgress += (progressByStage[stage.id] * stage.weight) / totalWeight;
    });
    
    // Call the parent callback with the overall progress
    callback(Math.max(0, Math.min(1, overallProgress)));
  };
  
  return { updateStageProgress };
};
