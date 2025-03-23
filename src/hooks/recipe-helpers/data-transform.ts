
import { Recipe } from '@/components/recipes/types';
import { BlogPost } from '@/services/blog/types';

/**
 * Converts blog posts to recipe format
 */
export function convertBlogPostsToRecipes(blogPosts: BlogPost[]): Recipe[] {
  return blogPosts.map(post => ({
    id: post.id.toString(),
    title: post.title,
    description: post.excerpt,
    imageUrl: post.imageUrl,
    date: post.date,
    link: post.link,
    blogPostId: post.id.toString() // Store the original blog post ID for reference
  }));
}

/**
 * Removes duplicate recipes based on title
 */
export function removeDuplicateRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.reduce((acc, current) => {
    const isDuplicate = acc.find(item => item.title === current.title);
    if (!isDuplicate) {
      acc.push(current);
    } else if (isDuplicate && !isDuplicate.imageUrl && current.imageUrl) {
      // If duplicate exists but doesn't have an image, use this one's image
      isDuplicate.imageUrl = current.imageUrl;
    }
    return acc;
  }, [] as Recipe[]);
}

/**
 * Enhances recipes data with matching blog posts
 */
export function enhanceRecipesWithBlogPosts(recipesData: Recipe[], blogPosts: BlogPost[]): Recipe[] {
  return recipesData.map(recipe => {
    // Try to find a matching blog post based on title similarity
    const matchingPost = blogPosts.find(post => 
      post.title.toLowerCase().includes(recipe.title.toLowerCase()) ||
      recipe.title.toLowerCase().includes(post.title.toLowerCase())
    );
    
    if (matchingPost) {
      return {
        ...recipe,
        imageUrl: matchingPost.imageUrl, // Use the blog post image
        blogPostId: matchingPost.id.toString()
      };
    }
    
    return recipe;
  });
}
