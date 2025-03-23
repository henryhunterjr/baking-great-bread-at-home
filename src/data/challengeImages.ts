
/**
 * Direct mapping of challenge IDs to their image paths
 * This allows for flexible image organization without enforcing strict naming conventions
 */
export const challengeImages: Record<string, string> = {
  // Updated paths to use the uploaded images
  "march-2025": "/lovable-uploads/77f6e22c-2ac2-4763-845e-39c5793b127d.png", // Updated March image
  "february-2025": "/lovable-uploads/92681740-cb01-4776-ab1d-fac0fb76acd6.png",
  "january-2025": "/lovable-uploads/a1e8e454-b660-424a-a223-abcf52875470.png",
  "december-2024": "/lovable-uploads/413db4c6-cdcc-4610-9e79-89f4a4aca97f.png",
  "november-2024": "/lovable-uploads/9617c8fa-0274-4499-9a97-ef063adb2d83.png",
  "halloween-2024": "/lovable-uploads/d2fca566-ffbc-49ea-9201-c97fb9ed3c3a.png",
  
  // These will use the traditional path structure
  "october-2024": "/challenges/images/october-2024-challenge.png",
  "september-2024": "/challenges/images/september-2024-challenge.png",
  "challah-2024": "/challenges/images/challah-2024-challenge.png",
  
  // Add additional entries for previous challenges as needed
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
