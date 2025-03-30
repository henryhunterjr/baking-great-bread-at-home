
import { logInfo, logError } from '@/utils/logger';
import { getOpenAIApiKey } from './key-management';
import { AI_CONFIG } from './config';

export interface BlogSearchResponse {
  success: boolean;
  results?: {
    title: string;
    excerpt: string;
    link: string;
    imageUrl?: string;
  }[];
  error?: string;
}

/**
 * Search blog content using AI
 * @param query The search query
 * @returns A response containing search results or an error
 */
export const searchBlogWithAI = async (query: string): Promise<BlogSearchResponse> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: 'AI service not configured with valid API key'
    };
  }
  
  try {
    const cleanQuery = query.toLowerCase()
      .replace(/do you have a/i, '')
      .replace(/can you find/i, '')
      .replace(/will you find me a/i, '')
      .replace(/find me a/i, '')
      .replace(/me/i, '')
      .replace(/please/i, '')
      .trim();
    
    logInfo('Searching blog for:', { query: cleanQuery });
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that searches for bread recipes. Return a simple JSON array of up to 3 most relevant recipes matching the query.'
            },
            {
              role: 'user',
              content: `Find bread recipes related to: ${cleanQuery}`
            }
          ],
          temperature: 0.5,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';
        const results = JSON.parse(jsonString);
        
        return {
          success: true,
          results: results.map((result: any) => ({
            title: result.title || `Recipe for ${cleanQuery}`,
            excerpt: result.description || 'A delicious bread recipe.',
            link: result.link || '#',
            imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
          }))
        };
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        
        const fallbackResults = getFallbackResults(cleanQuery);
        if (fallbackResults.length > 0) {
          return {
            success: true,
            results: fallbackResults
          };
        }
        
        return {
          success: true,
          results: [{
            title: `${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)} Recipe`,
            excerpt: `A delicious ${cleanQuery} recipe perfect for home bakers.`,
            link: '#',
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
          }]
        };
      }
    } catch (error) {
      logError('Error searching blog with AI:', { error });
      
      const fallbackResults = getFallbackResults(query);
      if (fallbackResults.length > 0) {
        return {
          success: true,
          results: fallbackResults
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  } catch (error) {
    logError('Error searching blog with AI:', { error });
    
    const fallbackResults = getFallbackResults(query);
    if (fallbackResults.length > 0) {
      return {
        success: true,
        results: fallbackResults
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get fallback recipe results if AI search fails
 * @param query The search query
 * @returns An array of fallback recipe results
 */
function getFallbackResults(query: string): any[] {
  const cleanQuery = query.toLowerCase().trim();
  
  const fallbackRecipes: Record<string, any[]> = {
    'banana bread': [
      {
        title: 'Henry\'s Classic Banana Bread',
        excerpt: 'A moist and flavorful banana bread that\'s perfect for using up overripe bananas. This family recipe has been perfected over generations.',
        link: '/recipes/classic-banana-bread',
        imageUrl: 'https://images.unsplash.com/photo-1594086385051-a72d28c7b99a?q=80&w=1000&auto=format&fit=crop'
      },
      {
        title: 'Whole Wheat Banana Bread',
        excerpt: 'A healthier take on the classic, using whole wheat flour and less sugar while maintaining that delicious banana flavor.',
        link: '/recipes/whole-wheat-banana-bread',
        imageUrl: 'https://images.unsplash.com/photo-1585023657880-8d726c65ba4e?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    'sourdough': [
      {
        title: 'Basic Sourdough Bread',
        excerpt: 'A simple and reliable sourdough recipe for beginners.',
        link: '/recipes/sourdough-basic',
        imageUrl: 'https://images.unsplash.com/photo-1585478259715-94acd1a91687?q=80&w=1000&auto=format&fit=crop'
      },
      {
        title: 'Rustic Sourdough Boule',
        excerpt: 'A rustic round loaf with a crisp crust and open crumb.',
        link: '/recipes/sourdough-boule',
        imageUrl: 'https://images.unsplash.com/photo-1559548331-f9cb98280344?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    'challah': [
      {
        title: 'Traditional Challah Bread',
        excerpt: 'A beautiful braided Jewish bread that\'s slightly sweet and perfect for special occasions.',
        link: '/recipes/traditional-challah',
        imageUrl: 'https://images.unsplash.com/photo-1603818652201-1c5a3fb9aa7c?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    'cinnamon roll': [
      {
        title: 'Cardamom-Infused Cinnamon Rolls',
        excerpt: 'Indulgent cinnamon rolls with a unique cardamom twist.',
        link: '/recipes/cardamom-cinnamon-rolls',
        imageUrl: '/lovable-uploads/379f3564-8f61-454c-9abe-3c7394d3794d.png'
      }
    ]
  };
  
  for (const [key, recipes] of Object.entries(fallbackRecipes)) {
    if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
      return recipes;
    }
  }
  
  if (cleanQuery.includes('banana')) {
    return fallbackRecipes['banana bread'];
  }
  
  if (cleanQuery.includes('cinnamon')) {
    return fallbackRecipes['cinnamon roll'];
  }
  
  return [];
}
