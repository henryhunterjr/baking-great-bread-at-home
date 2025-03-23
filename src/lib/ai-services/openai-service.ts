
import { AI_CONFIG } from './ai-config';
import { Recipe } from '@/types/recipe';

// OpenAI API interface
interface OpenAICompletionRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
}

/**
 * Sends a request to the OpenAI API for chat completion
 */
export const getChatCompletion = async (
  prompt: string,
  context: string = ''
): Promise<string> => {
  try {
    // Create system message based on context
    const systemMessage = context 
      ? `You are Henry's AI assistant specializing in bread baking. ${context}`
      : 'You are Henry\'s AI assistant specializing in bread baking. Provide helpful, concise answers to questions about bread baking techniques, recipes, and troubleshooting. Use a friendly, informative tone. If you don\'t know something, be honest and suggest resources.';
    
    const requestBody: OpenAICompletionRequest = {
      model: 'gpt-4o-mini', // Using OpenAI's recommended model
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    };
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json() as OpenAICompletionResponse;
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

/**
 * Generates a recipe based on user prompt using OpenAI
 */
export const generateRecipeWithAI = async (prompt: string): Promise<Recipe> => {
  try {
    const systemPrompt = `
You are an expert bread baker's AI assistant. Generate a detailed bread recipe based on the user's request.
Your response must be a valid JSON object with the following structure:
{
  "title": "Recipe Title",
  "description": "Brief description of the recipe",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount", "unit": "measurement unit"}
  ],
  "steps": ["Step 1 instruction", "Step 2 instruction"],
  "prepTime": 30, // preparation time in minutes
  "cookTime": 45, // cooking time in minutes
  "servings": 4,
  "tags": ["tag1", "tag2"],
  "notes": "Additional notes and tips"
}
Include detailed instructions and make it sound like it comes from an expert baker.`;

    const requestBody: OpenAICompletionRequest = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a bread recipe for: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json() as OpenAICompletionResponse;
    const recipeJson = JSON.parse(data.choices[0].message.content.trim());
    
    // Transform to match our Recipe type
    return {
      title: recipeJson.title,
      description: recipeJson.description,
      ingredients: recipeJson.ingredients,
      steps: recipeJson.steps,
      prepTime: recipeJson.prepTime,
      cookTime: recipeJson.cookTime,
      servings: recipeJson.servings,
      tags: recipeJson.tags,
      notes: recipeJson.notes,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      author: 'AI Assistant',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    };
  } catch (error) {
    console.error('Error generating recipe with OpenAI:', error);
    throw error;
  }
};

/**
 * Process recipe text using OpenAI
 */
export const processRecipeTextWithAI = async (recipeText: string): Promise<Recipe> => {
  try {
    const systemPrompt = `
You are an expert at converting raw recipe text into structured data. 
Convert the following recipe text into a JSON object with this structure:
{
  "title": "Recipe Title",
  "description": "Brief description of the recipe",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount", "unit": "measurement unit"}
  ],
  "steps": ["Step 1 instruction", "Step 2 instruction"],
  "prepTime": 30, // preparation time in minutes
  "cookTime": 45, // cooking time in minutes
  "servings": 4,
  "tags": ["tag1", "tag2"],
  "notes": "Additional notes and tips"
}
Make educated guesses for missing information.`;

    const requestBody: OpenAICompletionRequest = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: recipeText }
      ],
      temperature: 0.5,
      max_tokens: 1000
    };
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json() as OpenAICompletionResponse;
    let recipeJson;
    
    try {
      recipeJson = JSON.parse(data.choices[0].message.content.trim());
    } catch (e) {
      // Extract JSON from the response if it's not a clean JSON
      const content = data.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipeJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse recipe JSON from OpenAI response');
      }
    }
    
    // Transform to match our Recipe type
    return {
      title: recipeJson.title,
      description: recipeJson.description || '',
      ingredients: recipeJson.ingredients || [],
      steps: recipeJson.steps || [],
      prepTime: recipeJson.prepTime || 0,
      cookTime: recipeJson.cookTime || 0,
      servings: recipeJson.servings || 4,
      tags: recipeJson.tags || [],
      notes: recipeJson.notes || '',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      author: 'AI Assistant',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    };
  } catch (error) {
    console.error('Error processing recipe with OpenAI:', error);
    throw error;
  }
};
