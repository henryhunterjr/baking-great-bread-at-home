
import { logInfo, logError } from '@/utils/logger';
import { IndexedContent, ContentType } from '../types';
import { recipesData } from '@/data/recipesData';
import { breadRecipes } from '@/data/breadRecipes';

/**
 * Indexing Service
 * Handles indexing content from various sources
 */
export class IndexingService {
  constructor(private contentIndex: IndexedContent[]) {}
  
  /**
   * Index recipes from our data stores
   */
  public async indexRecipes(): Promise<void> {
    try {
      logInfo('Indexing recipes');
      
      // Combine recipes from multiple sources
      const allRecipes = [...recipesData, ...breadRecipes];
      
      const indexedRecipes = allRecipes.map(recipe => ({
        id: String(recipe.id), // Convert to string to match IndexedContent type
        title: recipe.title,
        content: recipe.description,
        excerpt: recipe.description.substring(0, 150) + '...',
        type: 'recipe' as ContentType,
        tags: recipe.tags || [],
        url: recipe.link || `/recipes/${recipe.id}`,
        imageUrl: recipe.imageUrl,
        metadata: {
          date: recipe.date
        }
      }));
      
      this.contentIndex.push(...indexedRecipes);
      logInfo('Recipes indexed successfully', { count: indexedRecipes.length });
    } catch (error) {
      logError('Error indexing recipes', { error });
    }
  }
  
  /**
   * Index blog posts from our data store or API
   */
  public async indexBlogPosts(): Promise<void> {
    try {
      logInfo('Indexing blog posts');
      
      // In a real implementation, this would fetch blog posts from an API
      // For now, we'll use some sample blog data from our recipes
      const blogPosts = recipesData.map(recipe => ({
        id: `blog-${recipe.id}`,
        title: `How to Make ${recipe.title}`,
        content: `This detailed guide walks you through creating ${recipe.title}. ${recipe.description} This post provides step-by-step instructions and helpful tips for bakers of all levels.`,
        excerpt: `Learn how to make ${recipe.title}. ${recipe.description.substring(0, 100)}...`,
        type: 'blog' as ContentType,
        tags: [...recipe.tags, 'tutorial', 'guide'],
        url: `/blog/${recipe.id}`,
        imageUrl: recipe.imageUrl,
        metadata: {
          date: recipe.date,
          author: 'Henry'
        }
      }));
      
      this.contentIndex.push(...blogPosts);
      logInfo('Blog posts indexed successfully', { count: blogPosts.length });
    } catch (error) {
      logError('Error indexing blog posts', { error });
    }
  }
}
