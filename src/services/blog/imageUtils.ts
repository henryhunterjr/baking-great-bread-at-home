
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

// Helper function to get image for a specific challenge by id or month name
export const getChallengeImage = (id: string): string => {
  console.log(`Looking for image with id: ${id}`);
  
  // Map challenge IDs to reliable Unsplash bread-related images
  const challengeImages: Record<string, string> = {
    // 2025 Challenges - using reliable Unsplash images
    'march-2025': 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=2000&auto=format&fit=crop',
    'february-2025': 'https://images.unsplash.com/photo-1559622214-f4a29c302d72?q=80&w=2000&auto=format&fit=crop',
    'january-2025': 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?q=80&w=2000&auto=format&fit=crop',
    
    // Using Unsplash images for other challenges
    'december-2024': 'https://images.unsplash.com/photo-1482930172332-2293d7138235?q=80&w=2000&auto=format&fit=crop',
    'november-2024': 'https://images.unsplash.com/photo-1586444248879-bc592f5dc49c?q=80&w=2000&auto=format&fit=crop',
    'halloween-2024': 'https://images.unsplash.com/photo-1476883852536-61979a5cdac9?q=80&w=2000&auto=format&fit=crop',
    'october-2024': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop',
    'september-2024': 'https://images.unsplash.com/photo-1592151450128-62f8a61aad8a?q=80&w=2000&auto=format&fit=crop',
    'challah-2024': 'https://images.unsplash.com/photo-1591401911894-7e8f0f3dd4a5?q=80&w=2000&auto=format&fit=crop',
    
    // Fallbacks for older challenges
    'march-2024': 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=2000&auto=format&fit=crop',
    'february-2024': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=80&w=2000&auto=format&fit=crop',
    'january-2024': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=2000&auto=format&fit=crop',
    'december-2023': 'https://images.unsplash.com/photo-1482930172332-2293d7138235?q=80&w=2000&auto=format&fit=crop',
    'november-2023': 'https://images.unsplash.com/photo-1586444248879-bc592f5dc49c?q=80&w=2000&auto=format&fit=crop',
    'october-2023': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop',
    'september-2023': 'https://images.unsplash.com/photo-1592151450128-62f8a61aad8a?q=80&w=2000&auto=format&fit=crop',
  };
  
  const imagePath = challengeImages[id];
  console.log(`Resolved image path: ${imagePath}`);
  
  // Using a reliable default fallback image from Unsplash
  const fallbackImage = 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=80&w=2000&auto=format&fit=crop';
  
  return imagePath || fallbackImage;
};
