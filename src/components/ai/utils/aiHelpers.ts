
import { ChatMessage, RecipeSearchResult } from './types';
import { booksData } from './data';
import BlogService from '@/services/BlogService';
import { recipesData } from '@/data/recipesData';
import { challenges } from '@/data/challengesData';
import { generateRecipe } from '@/lib/ai-services/ai-service';

// Current challenge is the first one in the challenges array
export const getCurrentChallenge = () => challenges[0];

// Search recipes across blog posts and recipe data
export const searchRecipes = async (query: string): Promise<RecipeSearchResult[]> => {
  try {
    const blogService = BlogService.getInstance();
    const blogPosts = await blogService.getPosts();
    
    const recipeMatches = recipesData.filter(recipe => 
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const blogRecipes = blogPosts.map(post => ({
      title: post.title,
      description: post.excerpt,
      imageUrl: post.imageUrl,
      link: post.link
    }));
    
    const combinedResults = [...blogRecipes];
    
    recipeMatches.forEach(recipe => {
      if (!combinedResults.some(r => r.title === recipe.title)) {
        combinedResults.push({
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          link: recipe.link
        });
      }
    });
    
    return combinedResults;
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
};

// Find a relevant book based on query terms
export const findRelevantBook = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  const directMatch = booksData.find(book => 
    book.title.toLowerCase().includes(lowerQuery)
  );
  
  if (directMatch) return directMatch;
  
  return booksData.find(book => 
    book.keywords.some(keyword => lowerQuery.includes(keyword))
  );
};

// Helper function to get challah recipes as fallback
export const getChallahRecipes = (): RecipeSearchResult[] => {
  return [
    {
      title: "Traditional Challah Bread Recipe",
      description: "A traditional Jewish bread recipe for the Sabbath and holidays with a beautiful braided pattern and rich egg dough.",
      imageUrl: "https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?q=80&w=1000&auto=format&fit=crop",
      link: "https://bakinggreatbread.blog/challah-bread-recipe"
    },
    {
      title: "Honey Challah Bread",
      description: "Sweetened with honey, this challah bread recipe creates a tender, flavorful loaf perfect for special occasions and holiday tables.",
      imageUrl: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop",
      link: "https://bakinggreatbread.blog/honey-challah-bread"
    },
    {
      title: "Sourdough Discard Challah Bread",
      description: "Use your sourdough discard to create a flavorful and beautiful braided challah bread with a subtle tang and perfect texture.",
      imageUrl: "https://images.unsplash.com/photo-1590137876181-2a5a7e340de2?q=80&w=1000&auto=format&fit=crop",
      link: "https://bakinggreatbread.blog/sourdough-discard-challah-bread"
    }
  ];
};

// Generate a recipe from a prompt
export const handleGenerateRecipe = async (prompt: string) => {
  if (!prompt.trim()) {
    throw new Error("Empty prompt");
  }
  
  return await generateRecipe(prompt);
};
