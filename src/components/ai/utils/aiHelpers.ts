
import { ChatMessage, RecipeSearchResult } from './types';
import { booksData } from './data';
import BlogService from '@/services/BlogService';
import { generateRecipe, RecipeGenerationResponse } from '@/lib/ai-services';
import { challenges, recipesData, generateRecipeWithOpenAI } from './mockData';

// Current challenge is the first one in the challenges array
export const getCurrentChallenge = () => challenges[0];

// Search recipes across blog posts and recipe data
export const searchRecipes = async (query: string): Promise<RecipeSearchResult[]> => {
  try {
    const blogService = BlogService.getInstance();
    
    // First attempt a direct search for exact matches
    const directSearchResults = await blogService.searchPosts(query);
    
    // Make search case-insensitive and more flexible
    const lowerQuery = query.toLowerCase();
    const searchTerms = lowerQuery.split(' ').filter(term => term.length > 2);
    
    // Special handling for specific recipe searches
    const specificRecipeQueries = {
      'cinnamon roll': [
        {
          title: "Henry's Cinnamon Rolls",
          description: "Soft and fluffy cinnamon rolls with a sweet glaze, perfect for weekend mornings.",
          imageUrl: "/lovable-uploads/d509f155-02f5-4d8f-9830-a26e2632ba95.png",
          link: "https://bakinggreatbread.blog/henrys-cinnamon-rolls/"
        }
      ],
      'challah': getChallahRecipes()
    };
    
    // Check for special recipe types first (exact matches)
    for (const [recipeType, specialRecipes] of Object.entries(specificRecipeQueries)) {
      if (lowerQuery.includes(recipeType)) {
        console.log(`Found specific recipe match for ${recipeType}`);
        return specialRecipes;
      }
    }
    
    // Process direct search results from the blog
    const blogRecipes = directSearchResults.map(post => ({
      title: post.title,
      description: post.excerpt,
      imageUrl: post.imageUrl,
      link: post.link
    }));
    
    // Find exact matches in recipe data
    const exactMatches = recipesData.filter(recipe => 
      recipe.title.toLowerCase().includes(lowerQuery)
    );
    
    // Find other relevant matches in recipe data
    const termMatches = recipesData.filter(recipe => {
      // Skip recipes already in exact matches
      if (exactMatches.some(match => match.id === recipe.id)) {
        return false;
      }
      
      const recipeText = (recipe.title + ' ' + recipe.description).toLowerCase();
      
      // Check for strong matches like "Henry's sourdough"
      if (lowerQuery.includes("henry's") && 
          (recipeText.includes("henry's") || recipeText.includes("henry")) && 
          (lowerQuery.includes("sourdough") && recipeText.includes("sourdough"))) {
        return true;
      }
      
      // Look for matches based on search terms
      return searchTerms.every(term => recipeText.includes(term));
    });
    
    // Combine all results, prioritizing blog results and exact matches
    const combinedResults = [...blogRecipes, ...exactMatches, ...termMatches];
    
    // Remove duplicates by link or title
    const uniqueResults: RecipeSearchResult[] = [];
    const seenTitles = new Set<string>();
    
    combinedResults.forEach(recipe => {
      if (!seenTitles.has(recipe.title.toLowerCase())) {
        seenTitles.add(recipe.title.toLowerCase());
        uniqueResults.push(recipe);
      }
    });
    
    console.log(`Search for "${query}" returned ${uniqueResults.length} results`);
    
    // Return results or special handling for common queries
    if (uniqueResults.length > 0) {
      return uniqueResults;
    }
    
    // Add special handling for Henry's sourdough loaf
    if (lowerQuery.includes("henry") && lowerQuery.includes("sourdough")) {
      return [{
        title: "Henry's Foolproof Sourdough Loaf",
        description: "A reliable and easy sourdough recipe with a touch of sweetness from honey.",
        imageUrl: "/lovable-uploads/d32e1aa2-fbf9-4793-9f06-54206973eadd.png",
        link: "https://bakinggreatbread.blog/2023/12/20/henry-foolproof-sourdough-loaf/"
      }];
    }
    
    return [];
  } catch (error) {
    console.error("Error searching recipes:", error);
    
    // Fallback for common searches
    const lowerQuery = query.toLowerCase();
    
    // Fallback for Henry's sourdough loaf search
    if (lowerQuery.includes("henry") && lowerQuery.includes("sourdough")) {
      return [{
        title: "Henry's Foolproof Sourdough Loaf",
        description: "A reliable and easy sourdough recipe with a touch of sweetness from honey.",
        imageUrl: "/lovable-uploads/d32e1aa2-fbf9-4793-9f06-54206973eadd.png",
        link: "https://bakinggreatbread.blog/2023/12/20/henry-foolproof-sourdough-loaf/"
      }];
    }
    
    // Fallback for cinnamon rolls
    if (lowerQuery.includes("cinnamon roll") || lowerQuery.includes("cinnamon bun")) {
      return [{
        title: "Henry's Cinnamon Rolls",
        description: "Soft and fluffy cinnamon rolls with a sweet glaze, perfect for weekend mornings.",
        imageUrl: "/lovable-uploads/d509f155-02f5-4d8f-9830-a26e2632ba95.png",
        link: "https://bakinggreatbread.blog/henrys-cinnamon-rolls/"
      }];
    }
    
    return [];
  }
};

// Generate a recipe using OpenAI API
export const generateRecipeWithAI = async (query: string): Promise<RecipeSearchResult | null> => {
  try {
    const response = await generateRecipeWithOpenAI(query);
    
    if (!response || !response.recipe) {
      return null;
    }
    
    // Create a recipe result from the OpenAI response
    return {
      title: response.recipe.title,
      description: response.recipe.introduction,
      imageUrl: "/lovable-uploads/e000aa47-dec6-46ac-b437-e0a1985fcc5f.png", // Default image for AI-generated recipes
      link: "#", // AI-generated recipes don't have a link yet
      isGenerated: true
    };
  } catch (error) {
    console.error("Error generating recipe with AI:", error);
    return null;
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
export const handleGenerateRecipe = async (prompt: string): Promise<RecipeGenerationResponse> => {
  try {
    const response = await generateRecipe(prompt);
    return response;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const mapRecipeResponseToSearchResult = (response: RecipeGenerationResponse): RecipeSearchResult | null => {
  if (!response.success || !response.recipe) {
    return null;
  }

  // Create a recipe result from the OpenAI response
  return {
    title: response.recipe.title,
    description: response.recipe.introduction,
    imageUrl: "/lovable-uploads/e000aa47-dec6-46ac-b437-e0a1985fcc5f.png", // Default image for AI-generated recipes
    link: "#", // AI-generated recipes don't have a link yet
    isGenerated: true
  };
};
