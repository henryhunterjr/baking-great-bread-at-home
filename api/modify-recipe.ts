
import { NextApiRequest, NextApiResponse } from 'next';
import { RecipeData } from '../src/types/recipeTypes';

interface ModifyRecipeRequest {
  recipe: RecipeData;
  suggestion: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipe, suggestion } = req.body as ModifyRecipeRequest;

    if (!recipe || !suggestion) {
      return res.status(400).json({ error: 'Recipe and suggestion are required' });
    }

    // Call OpenAI to interpret the suggestions and modify the recipe
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a recipe modification assistant. Your task is to modify a recipe based on suggestions.
            You will receive a recipe in JSON format and a text suggestion for modifications.
            Apply the suggestions to the recipe and return the modified recipe in the same JSON structure.
            Do not change any fields that aren't mentioned in the suggestions.
            Make sure to preserve the recipe's structure.`
          },
          {
            role: 'user',
            content: `Here is the original recipe:
            ${JSON.stringify(recipe, null, 2)}
            
            And here are the modification suggestions:
            "${suggestion}"
            
            Please return the modified recipe in the same JSON structure.`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return res.status(openaiResponse.status).json({ 
        error: 'Failed to modify recipe', 
        details: errorData 
      });
    }

    const data = await openaiResponse.json();
    const responseContent = data.choices[0].message.content;
    
    // Parse the JSON from the response
    let modifiedRecipe;
    try {
      // Look for JSON in the response
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                        responseContent.match(/{[\s\S]*?}/);
      
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseContent;
      modifiedRecipe = JSON.parse(jsonString);
      
      // Ensure recipe has the required fields
      if (!modifiedRecipe.id) modifiedRecipe.id = recipe.id;
      if (!modifiedRecipe.createdAt) modifiedRecipe.createdAt = recipe.createdAt;
      modifiedRecipe.updatedAt = Date.now();
      
    } catch (parseError) {
      console.error('Error parsing modified recipe:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse modified recipe',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      });
    }

    return res.status(200).json({ 
      modifiedRecipe,
      originalRecipe: recipe
    });
  } catch (error) {
    console.error('Error modifying recipe:', error);
    return res.status(500).json({ 
      error: 'Failed to process recipe modification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
