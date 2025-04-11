
import type { NextApiRequest, NextApiResponse } from 'next';

interface GenerateImageRequest {
  title: string;
  ingredients?: string[];
  recipeType?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, ingredients, recipeType } = req.body as GenerateImageRequest;

    if (!title) {
      return res.status(400).json({ error: 'Recipe title is required' });
    }

    console.log("Generating recipe image", {
      title,
      ingredientsCount: ingredients?.length || 0,
      hasRecipeType: !!recipeType
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
      console.error('OpenAI API key is not configured');
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured',
        message: 'Please add your OpenAI API key in the environment variables.'
      });
    }

    // Call the OpenAI API to generate an image
    try {
      console.log("Calling OpenAI API for image generation", { prompt: prompt.substring(0, 100) + "..." });
      
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
        console.error('OpenAI API error:', errorData);
        return res.status(openaiResponse.status).json({ 
          error: 'Failed to generate image', 
          details: errorData 
        });
      }

      const data = await openaiResponse.json();
      const imageUrl = data.data[0].url;
      
      console.log("Image generated successfully", { hasImageUrl: !!imageUrl });

      return res.status(200).json({ imageUrl });
    } catch (apiError) {
      console.error('Error calling OpenAI API:', apiError);
      return res.status(500).json({ 
        error: 'Error calling OpenAI API',
        details: apiError instanceof Error ? apiError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
