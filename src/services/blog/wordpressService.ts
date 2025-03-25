
import { BlogPost } from './types';
import { getPlaceholderImage } from './imageUtils';

export const fetchFromWordPressAPI = async (): Promise<BlogPost[]> => {
  const response = await fetch('https://bakinggreatbread.blog/wp-json/wp/v2/posts?_embed&per_page=10');
  
  if (!response.ok) {
    throw new Error('WordPress API not available');
  }
  
  const data = await response.json();
  
  return data.map((post: any) => ({
    id: post.id,
    title: post.title.rendered,
    excerpt: stripHtmlTags(post.excerpt.rendered).substring(0, 150) + '...',
    date: new Date(post.date).toLocaleDateString(),
    imageUrl: extractFeaturedImage(post),
    link: post.link
  }));
};

const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const extractFeaturedImage = (post: any): string => {
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
