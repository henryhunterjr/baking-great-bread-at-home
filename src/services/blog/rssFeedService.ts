
import { BlogPost } from './types';
import { getPlaceholderImage } from './blogUtils';

export const fetchFromRSSFeed = async (): Promise<BlogPost[]> => {
  const response = await fetch('https://bakinggreatbread.blog/feed/');
  
  if (!response.ok) {
    throw new Error('RSS feed not available');
  }
  
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  const items = xmlDoc.querySelectorAll('item');
  
  return Array.from(items).slice(0, 10).map((item, index) => {
    const title = item.querySelector('title')?.textContent || 'Untitled Post';
    const link = item.querySelector('link')?.textContent || '#';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const content = item.querySelector('content\\:encoded, encoded')?.textContent || '';
    
    // Extract the first image from content with more robust pattern matching
    let imageUrl = '';
    
    try {
      // Try to find any image tag in the content
      const imgMatch = content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/i);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
      }
      
      // If no image found, try other media tags
      if (!imageUrl) {
        // Check for media:content tags
        const mediaMatch = content.match(/<media:content\s+[^>]*url="([^"]*)"[^>]*>/i);
        if (mediaMatch && mediaMatch[1]) {
          imageUrl = mediaMatch[1];
        }
      }
    } catch (error) {
      console.error('Error extracting image from RSS content:', error);
    }
    
    // Use placeholder if no image found
    if (!imageUrl) {
      imageUrl = getPlaceholderImage(index);
    }
    
    // Extract text content for excerpt with better error handling
    let excerpt = '';
    try {
      const div = document.createElement('div');
      div.innerHTML = content;
      excerpt = (div.textContent || div.innerText || '').trim().substring(0, 150) + '...';
    } catch (error) {
      console.error('Error extracting excerpt from RSS content:', error);
      excerpt = 'No excerpt available...';
    }
    
    return {
      id: index,
      title,
      excerpt,
      date: new Date(pubDate).toLocaleDateString(),
      imageUrl,
      link
    };
  });
};
