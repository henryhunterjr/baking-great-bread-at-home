
/**
 * Direct mapping of challenge IDs to their image paths
 * This allows for flexible image organization without enforcing strict naming conventions
 */
export const challengeImages: Record<string, string> = {
  "march-2025": "/lovable-uploads/0c5a9920-c2aa-4608-89e4-59efa100dffa.png",
  "february-2025": "/lovable-uploads/92681740-cb01-4776-ab1d-fac0fb76acd6.png",
  "january-2025": "/lovable-uploads/a1e8e454-b660-424a-a223-abcf52875470.png",
  "december-2024": "/lovable-uploads/413db4c6-cdcc-4610-9e79-89f4a4aca97f.png",
  "november-2024": "/lovable-uploads/9617c8fa-0274-4499-9a97-ef063adb2d83.png",
  "halloween-2024": "/lovable-uploads/d2fca566-ffbc-49ea-9201-c97fb9ed3c3a.png",
  "october-2024": "/challenges/images/october-2024-challenge.png",
  "september-2024": "/challenges/images/september-2024-challenge.png",
  "challah-2024": "/challenges/images/challah-2024-challenge.png",
  // Previous challenges can be added as needed
};

/**
 * Default fallback image to use when no specific image is found
 */
export const DEFAULT_CHALLENGE_IMAGE = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=85&w=1200&auto=format&fit=crop";

