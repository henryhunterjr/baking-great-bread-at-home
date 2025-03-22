
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
  // Try to get featured media
  if (post._embedded && 
      post._embedded['wp:featuredmedia'] && 
      post._embedded['wp:featuredmedia'][0] && 
      post._embedded['wp:featuredmedia'][0].source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  
  // Fallback to first image in content
  const contentMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
  if (contentMatch) {
    return contentMatch[1];
  }
  
  // Default placeholder
  return getPlaceholderImage(post.id);
};
