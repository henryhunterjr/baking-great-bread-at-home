
import BlogServiceCore from './blog/BlogServiceCore';
import { useBlogPosts } from './blog/useBlogPosts';
import { BlogPost } from './blog/types';

// Re-export the BlogServiceCore as BlogService
const BlogService = BlogServiceCore;

// Export the hook and types
export { useBlogPosts };
export type { BlogPost };
export default BlogService;
