import { challengeImages, DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';

// Helper function to get placeholder image for a blog post
export const getPlaceholderImage = (id: number): string => {
  // Array of bread-related Unsplash images to use as placeholders
  const breadImages = [
    'https://images.unsplash.com/photo-1585478259715-1c195ae2b568',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    'https://images.unsplash.com/photo-1603379016822-e6d5e2770ece',
    'https://images.unsplash.com/photo-1574085733277-851d9d856a3a',
    'https://images.unsplash.com/photo-1590137876181-2a5a7e340de2',
    'https://images.unsplash.com/photo-1586444248879-bc604cbd555a',
    'https://images.unsplash.com/photo-1583302355372-a9dee721efe9',
    'https://images.unsplash.com/photo-1598373182133-52452f7691ef',
  ];
  
  // Use the id to select a placeholder image deterministically
  const index = id % breadImages.length;
  return `${breadImages[index]}?q=80&w=1000&auto=format&fit=crop`;
};

/**
 * Simplified challenge image loading strategy:
 * 1. Check for image in the challengeImages config map
 * 2. Try Gamma screenshot fallback
 * 3. Fall back to default Unsplash image
 */
export const getChallengeImage = (id: string): string => {
  // First tier: Check for image in the configuration map
  if (challengeImages[id]) {
    console.log(`✅ [Challenge ${id}] Using configured image path`);
    return challengeImages[id];
  }
  
  // Second tier: Try Gamma screenshot
  const gammaScreenshotPath = `/challenges/gamma/${id}-screenshot.jpg`;
  
  // For now, we'll skip checking if the gamma image exists here
  // This will be checked at runtime in the component
  console.log(`🔄 [Challenge ${id}] Configured image not found, trying Gamma screenshot`);
  
  // Third tier: Use default fallback image
  console.log(`🌐 [Challenge ${id}] Using default fallback image`);
  return DEFAULT_CHALLENGE_IMAGE;
};

/**
 * Enhanced challenge image loading with metadata
 * Returns an object with image path and metadata to help with debugging
 */
export const getEnhancedChallengeImage = (id: string): { 
  src: string, 
  tier: 'configured' | 'gamma' | 'default',
  fallbackAvailable: boolean
} => {
  // First tier: Check for image in the configuration map
  if (challengeImages[id]) {
    return {
      src: challengeImages[id],
      tier: 'configured',
      fallbackAvailable: true
    };
  }
  
  // Second tier: Try Gamma screenshot
  const gammaScreenshotPath = `/challenges/gamma/${id}-screenshot.jpg`;
  
  // We'll return the gamma path, but the actual existence check will happen in the component
  return {
    src: gammaScreenshotPath,
    tier: 'gamma',
    fallbackAvailable: true
  };
  
  // The fallback to default will happen in the component if both configured and gamma fail
};
