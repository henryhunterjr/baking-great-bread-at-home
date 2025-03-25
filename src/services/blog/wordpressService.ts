
import { BlogPost } from './types';
import { stripHtmlTags, extractFeaturedImage } from './blogUtils';

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
