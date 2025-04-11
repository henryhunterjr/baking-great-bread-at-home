
import { logInfo, logError } from '@/utils/logger';

interface GenerateImageRequest {
  title: string;
  ingredients?: string[];
  recipeType?: string;
}

export async function generateRecipeImage(
  requestData: GenerateImageRequest
): Promise<{ imageUrl?: string; error?: string; details?: any }> {
  try {
    const { title, ingredients, recipeType } = requestData;

    if (!title) {
      const error = 'Recipe title is required';
      logError(error, {});
      return { error };
    }

    logInfo("Generating recipe image", {
      data: {
        title,
        ingredientsCount: ingredients?.length || 0,
        hasRecipeType: !!recipeType
      }
    });

    // Create a detailed prompt for the AI to generate a relevant food image
    let prompt = `A professional, appetizing food photography of ${title}.`;
    
    // Add context from ingredients if available
    if (ingredients && ingredients.length > 0) {
      const keyIngredients = ingredients.slice(0, 5).join(', ');
      prompt += ` The dish contains ${keyIngredients}.`;
    }
    
    // Add style details for better results
    prompt += ` Professional food photography, overhead shot, natural lighting, on a wooden table, high resolution, 4K, detailed, mouth-watering presentation.`;

    // Check if OpenAI API key is available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      const errorMessage = 'OpenAI API key is not configured';
      logError(errorMessage, {});
      return { 
        error: errorMessage,
        details: 'Please add your OpenAI API key in the environment variables.'
      };
    }

    // Call the OpenAI API to generate an image
    try {
      logInfo("Calling OpenAI API for image generation", { 
        data: { 
          promptPreview: prompt.substring(0, 100) + "..." 
        }
      });
      
      const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url',
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        logError('OpenAI API error:', { data: errorData });
        return { 
          error: 'Failed to generate image', 
          details: errorData 
        };
      }

      const data = await openaiResponse.json();
      const imageUrl = data.data[0].url;
      
      logInfo("Image generated successfully", { data: { hasImageUrl: !!imageUrl } });

      return { imageUrl };
    } catch (apiError) {
      logError('Error calling OpenAI API:', { error: apiError });
      return { 
        error: 'Error calling OpenAI API',
        details: apiError instanceof Error ? apiError.message : 'Unknown error'
      };
    }
  } catch (error) {
    logError('Error generating image:', { error });
    return { 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
