import { challengeImages, DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';

/**
 * Get the image URL for a specific challenge
 * @param challengeId The ID of the challenge
 * @returns The image URL for the challenge or a default image if not found
 */
export const getChallengeImage = (challengeId: string): string => {
  // First, check if there's a directly configured image in the challengeImages map
  if (challengeImages[challengeId]) {
    return challengeImages[challengeId];
  }
  
  // Second, check if there's a gamma screenshot
  const gammaScreenshot = `/challenges/gamma/${challengeId}-screenshot.jpg`;
  
  // Third, fallback to the default image
  return DEFAULT_CHALLENGE_IMAGE;
};
