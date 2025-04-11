
import { RecipeData } from '@/types/recipeTypes';
import { parseAIResponseToRecipe } from '@/utils/recipeParser';
import { logError } from '@/utils/logger';
import { updateOpenAIApiKey, getOpenAIApiKey } from '@/lib/ai-services';

export async function findRecipe(query: string): Promise<RecipeData | null> {
  try {
    updateOpenAIApiKey();
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a specialized bread recipe generator. Generate a complete, detailed bread recipe for the user's request.
            Include these sections: Title, Ingredients (with measurements), Instructions (numbered steps), Notes (optional).
            Format example:
            
            [Recipe Name]
            
            Prep Time: X minutes
            Cook Time: X minutes
            Servings: X
            
            Ingredients:
            - 500g bread flour
            - 350ml water
            - etc.
            
            Instructions:
            1. First step
            2. Second step
            3. Etc.
            
            Notes:
            - Note 1
            - Note 2
            
            Only include relevant information for making the bread recipe. Be concise but thorough.` 
          },
          { 
            role: 'user', 
            content: `Create a bread recipe for: ${query}` 
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.status}`);
    }
    
    const data = await response.json();
    const recipeText = data.choices[0].message.content;
    
    const parsedRecipe = parseAIResponseToRecipe(recipeText);
    
    if (!parsedRecipe) {
      return {
        title: `${query} Bread`,
        ingredients: ["Failed to parse recipe ingredients"],
        instructions: ["Failed to parse recipe instructions"],
        isConverted: true
      };
    }
    
    return parsedRecipe;
  } catch (error) {
    logError('Recipe generation error', { error, query });
    return null;
  }
}

export async function askAIQuestion(question: string): Promise<string> {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return "API key not configured. Please set up your OpenAI API key in settings.";
  }
  
  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful bread baking assistant. Provide detailed, accurate information about bread baking techniques, recipes, troubleshooting, and ingredients. Keep answers focused on bread and baking topics.' },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (aiResponse.ok) {
      const data = await aiResponse.json();
      return data.choices[0].message.content;
    }
    
    return "Sorry, I couldn't get an answer from the AI service right now.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I encountered an error while processing your request.";
  }
}

export function generateBreadResponse(question: string): string {
  if (question.toLowerCase().includes('hydration')) {
    return "Hydration refers to the ratio of water to flour in your dough. For a standard white bread, 65-70% hydration is typical. Increase to 75-85% for more open crumb structures like ciabatta.";
  } else if (question.toLowerCase().includes('sourdough')) {
    return "Sourdough fermentation typically takes 4-12 hours depending on your starter strength and ambient temperature. I'd recommend starting with a 4-hour bulk fermentation at room temperature.";
  } else if (question.toLowerCase().includes('knead')) {
    return "Kneading develops gluten structure. For most bread recipes, 10-12 minutes of hand-kneading or 5-8 minutes in a stand mixer on medium speed is sufficient.";
  } else if (question.toLowerCase().includes('flour')) {
    return "Bread flour typically has a protein content of 12-14%, which helps develop stronger gluten networks. All-purpose flour is around 10-12% protein and works well for most home baking applications.";
  }
  
  return "";
}
