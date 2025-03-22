
import { BlogPost } from './types';
import { getPlaceholderImage } from './imageUtils';

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
    
    // Extract the first image from content
    const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageMatch ? imageMatch[1] : getPlaceholderImage(index);
    
    // Extract text content for excerpt
    const div = document.createElement('div');
    div.innerHTML = content;
    const excerpt = div.textContent?.trim().substring(0, 150) + '...' || '';
    
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
