
/**
 * Direct mapping of challenge IDs to their image paths
 * This allows for flexible image organization without enforcing strict naming conventions
 */
export const challengeImages: Record<string, string> = {
  "march-2025": "/challenges/march-2025-challenge.png",
  "february-2025": "/challenges/february-2025-challenge.png",
  "january-2025": "/challenges/january-2025-challenge.png",
  "december-2024": "/challenges/december-2024-challenge.png",
  "november-2024": "/challenges/november-2024-challenge.png",
  "halloween-2024": "/challenges/halloween-2024-challenge.png",
  "october-2024": "/challenges/october-2024-challenge.png",
  "september-2024": "/challenges/september-2024-challenge.png",
  "challah-2024": "/challenges/challah-2024-challenge.png",
  // Previous challenges can be added as needed
};

/**
 * Default fallback image to use when no specific image is found
 */
export const DEFAULT_CHALLENGE_IMAGE = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=85&w=1200&auto=format&fit=crop";
