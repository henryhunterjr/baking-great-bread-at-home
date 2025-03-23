
/**
 * Direct mapping of challenge IDs to their image paths
 * This allows for flexible image organization without enforcing strict naming conventions
 */
export const challengeImages: Record<string, string> = {
  "march-2025": "/challenges/images/march-2025-challenge.png",
  "february-2025": "/challenges/images/february-2025-challenge.png",
  "january-2025": "/challenges/images/january-2025-challenge.png",
  "december-2024": "/challenges/images/december-2024-challenge.png",
  "november-2024": "/challenges/images/november-2024-challenge.png",
  "halloween-2024": "/challenges/images/halloween-2024-challenge.png",
  "october-2024": "/challenges/images/october-2024-challenge.png",
  "september-2024": "/challenges/images/september-2024-challenge.png",
  "challah-2024": "/challenges/images/challah-2024-challenge.png",
  // Previous challenges can be added as needed
};

/**
 * Default fallback image to use when no specific image is found
 */
export const DEFAULT_CHALLENGE_IMAGE = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=85&w=1200&auto=format&fit=crop";
