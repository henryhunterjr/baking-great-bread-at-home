
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

// Helper function to get image for a specific challenge by id
export const getChallengeImage = (id: string): string => {
  // Use a simplified approach with a set of reliable Unsplash bread images
  const reliableImages = {
    // More recent challenges - use most reliable high-quality images
    'march-2025': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'february-2025': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c',
    'january-2025': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    
    // Themed challenges
    'cultural': 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877',
    'love': 'https://images.unsplash.com/photo-1559622214-f4a29c302d72',
    'healthy': 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a',
    'gift': 'https://images.unsplash.com/photo-1482930172332-2293d7138235',
    'enriched': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'halloween': 'https://images.unsplash.com/photo-1476883852536-61979a5cdac9',
    'basic': 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'lunch': 'https://images.unsplash.com/photo-1592151450128-62f8a61aad8a',
    'challah': 'https://images.unsplash.com/photo-1591401911894-7e8f0f3dd4a5',
    'default': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c'
  };
  
  // First check if we have a direct match for the challenge ID
  if (reliableImages[id]) {
    return `${reliableImages[id]}?q=80&w=1000&auto=format&fit=crop`;
  }
  
  // Challenge ID to theme mapping (for older challenges)
  const challengeThemes: Record<string, string> = {
    'december-2024': 'gift',
    'november-2024': 'enriched',
    'halloween-2024': 'halloween',
    'october-2024': 'basic',
    'september-2024': 'lunch',
    'challah-2024': 'challah',
    'march-2024': 'cultural',
    'february-2024': 'love',
    'january-2024': 'healthy',
    'december-2023': 'gift',
    'november-2023': 'enriched',
    'october-2023': 'basic',
    'september-2023': 'lunch'
  };
  
  // Get theme for this challenge, or use default
  const theme = challengeThemes[id] || 'default';
  
  // Return themed image with quality parameters
  return `${reliableImages[theme]}?q=80&w=1000&auto=format&fit=crop`;
};
