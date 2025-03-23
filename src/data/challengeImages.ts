
/**
 * Direct mapping of challenge IDs to their image paths
 * This allows for flexible image organization without enforcing strict naming conventions
 */
export const challengeImages: Record<string, string> = {
  // 2025 Challenges
  "march-2025": "/lovable-uploads/77f6e22c-2ac2-4763-845e-39c5793b127d.png",
  "february-2025": "/lovable-uploads/273f5757-c7b7-4bbf-a8d5-cbd5874d4798.png",
  "january-2025": "/lovable-uploads/a7b11bfd-dfbd-48f6-8a26-8de8b68087d0.png",
  
  // 2024 Challenges with new images
  "december-2024": "/lovable-uploads/f8b0ed02-1828-4072-891f-9d5bb4f24a17.png", // Give Bread Instead
  "november-2024": "/lovable-uploads/49b5c11a-3449-45ca-afb4-789f3e792bbd.png", // Baking Great Bread At Home
  "halloween-2024": "/lovable-uploads/fb623033-8695-478f-94fb-d255e6d62813.png", // Bewitching Breads
  "october-2024": "/lovable-uploads/78a30c83-7d6c-480e-b2d3-c759f597e89d.png", // Basic Bread Baking
  "challah-2024": "/lovable-uploads/54241cef-9291-4e07-895d-1a29aaf5f357.png", // Challah Challenge
  "september-2024": "/lovable-uploads/9617c8fa-0274-4499-9a97-ef063adb2d83.png",
  
  // 2023 entries
  "march-2024": "/challenges/images/march-2024-challenge.png",
  "february-2024": "/challenges/images/february-2024-challenge.png",
  "january-2024": "/challenges/images/january-2024-challenge.png",
  
  // Add newly uploaded images if available
  "2023-holiday-special": "/lovable-uploads/fafd0fe4-ce90-42a1-9f6f-0b4ea67e908c.png",
  "2023-autumn-bake": "/lovable-uploads/1cf97fbb-e14d-4580-8a1e-d48c344281ec.png",
  "2023-summer-bread": "/lovable-uploads/583f35cf-db1d-4d0e-8cc0-c693029b3b50.png",
  "2023-spring-sourdough": "/lovable-uploads/2220ae62-3d16-4e36-83c1-cd18e6b2180b.png",
};

/**
 * Default fallback image to use when no specific image is found
 */
export const DEFAULT_CHALLENGE_IMAGE = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=85&w=1200&auto=format&fit=crop";
