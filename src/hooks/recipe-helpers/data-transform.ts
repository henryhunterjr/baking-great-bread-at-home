
import { BlogPost } from '@/services/blog/types';
import { Recipe } from '@/components/recipes/types';
import { breadRecipes } from '@/data/breadRecipes';

/**
 * Convert BlogPost objects to Recipe objects
 */
export const convertBlogPostsToRecipes = (blogPosts: BlogPost[]): Recipe[] => {
  return blogPosts.map(post => ({
    id: post.id,
    title: post.title,
    description: post.excerpt,
    imageUrl: post.imageUrl,
    date: post.date,
    link: post.link,
    blogPostId: typeof post.id === 'number' ? post.id.toString() : post.id
  }));
};

/**
 * Enhance static recipe data with matching blog posts
 */
export const enhanceRecipesWithBlogPosts = (
  recipesData: Recipe[],
  blogPosts: BlogPost[]
): Recipe[] => {
  // Create a map for quick lookup of blog posts by title similarity
  const blogPostMap = new Map<string, BlogPost>();
  
  blogPosts.forEach(post => {
    const normalizedTitle = post.title.toLowerCase().trim();
    blogPostMap.set(normalizedTitle, post);
    
    // Also add keywords for better matching
    const keywords = normalizedTitle.split(' ');
    keywords.forEach(keyword => {
      if (keyword.length > 4) {
        blogPostMap.set(keyword, post);
      }
    });
  });
  
  // Enhance recipes with blog post data
  return recipesData.map(recipe => {
    const normalizedTitle = recipe.title.toLowerCase().trim();
    const matchingPost = blogPostMap.get(normalizedTitle);
    
    if (matchingPost) {
      return {
        ...recipe,
        imageUrl: matchingPost.imageUrl || recipe.imageUrl,
        date: matchingPost.date || recipe.date,
        link: matchingPost.link || recipe.link,
        blogPostId: typeof matchingPost.id === 'number' ? 
          matchingPost.id.toString() : matchingPost.id
      };
    }
    
    return recipe;
  });
};

/**
 * Remove duplicate recipes based on title
 */
export const removeDuplicateRecipes = (recipes: Recipe[]): Recipe[] => {
  const seen = new Set<string>();
  const unique: Recipe[] = [];
  
  // First prioritize our custom bread recipes
  breadRecipes.forEach(recipe => {
    seen.add(recipe.title.toLowerCase());
    unique.push(recipe);
  });
  
  // Then add the rest
  recipes.forEach(recipe => {
    const lowerTitle = recipe.title.toLowerCase();
    if (!seen.has(lowerTitle)) {
      seen.add(lowerTitle);
      unique.push(recipe);
    }
  });
  
  return unique;
};
