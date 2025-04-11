
export const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const extractFeaturedImage = (post: any): string => {
  // Try to get featured media with more robust handling
  if (post._embedded && 
      post._embedded['wp:featuredmedia'] && 
      post._embedded['wp:featuredmedia'][0]) {
      
    // Try to get the medium_large size first (better for performance)
    if (post._embedded['wp:featuredmedia'][0].media_details && 
        post._embedded['wp:featuredmedia'][0].media_details.sizes) {
      
      const sizes = post._embedded['wp:featuredmedia'][0].media_details.sizes;
      
      // Prioritize sizes in order of preference
      const sizePreference = ['medium_large', 'large', 'medium', 'full'];
      
      for (const size of sizePreference) {
        if (sizes[size] && sizes[size].source_url) {
          return sizes[size].source_url;
        }
      }
    }
    
    // Fallback to source_url if sizes are not available
    if (post._embedded['wp:featuredmedia'][0].source_url) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
  }
  
  // Fallback to first image in content with more robust error handling
  try {
    if (post.content && post.content.rendered) {
      const contentMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
      if (contentMatch && contentMatch[1]) {
        return contentMatch[1];
      }
    }
  } catch (error) {
    console.error('Error extracting image from content:', error);
  }
  
  // Default placeholder with better error handling
  return getPlaceholderImage(post.id);
};

// Helper function to get placeholder image for a blog post
export const getPlaceholderImage = (id: number): string => {
  // Array of bread-related Unsplash images to use as placeholders - using the ixlib parameter for better caching
  const breadImages = [
    'https://images.unsplash.com/photo-1585478259715-1c195ae2b568?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1606884285898-277317a7bf12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1619173564606-0064c586452a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1574087093774-8204801c0e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    '/lovable-uploads/da5b9006-4aad-4bf1-89a8-83c3b3ebf7e0.png',
  ];
  
  // Use the id to select a placeholder image deterministically
  const index = Math.abs(id) % breadImages.length;
  return breadImages[index];
};
