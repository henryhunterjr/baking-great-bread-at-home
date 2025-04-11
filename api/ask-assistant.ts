
import { NextApiRequest, NextApiResponse } from 'next';
import { RecipeData } from '../src/types/recipeTypes';
import { ChatMessage } from '../src/components/recipe-converter/types/chat';
import { isRecipeQuestion, searchBlogForRecipes } from '../src/utils/blogSearch';

interface AssistantRequest {
  message: string;
  recipeContext?: RecipeData;
  chatHistory?: ChatMessage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, recipeContext, chatHistory } = req.body as AssistantRequest;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create a more distinctive baker persona
    let systemPrompt = `You are an experienced master baker with decades of knowledge about bread, pastry, and all aspects of baking.

Style: Speak with warmth, patience and authority. Use proper baking terminology (hydration levels, fermentation, proofing, etc.) when appropriate, but explain these terms for beginners. Share insights from your wealth of experience, including common mistakes and troubleshooting tips.

Knowledge: You have extensive expertise beyond just bread - including pastries, cakes, cookies, global baking traditions, ingredient substitutions, and dietary accommodations. You understand both traditional and modern baking techniques.

Persona: Imagine yourself as a friendly bakery owner who has taught thousands of students. You're passionate about helping home bakers succeed and take pride in clear, practical advice that produces great results.

Response Style: Answer questions thoroughly but conversationally. Use descriptive language that helps bakers visualize textures and processes. When appropriate, break instructions into clear steps. For complex techniques, provide both a quick answer and a more detailed explanation.`;
    
    // Check if this is a recipe-related question
    if (isRecipeQuestion(message)) {
      // Search the blog for relevant recipes
      const blogRecipes = await searchBlogForRecipes(message);
      
      // If blog recipes found, include them in the context
      if (blogRecipes && blogRecipes.length > 0) {
        let recipeContext = `\n\nI found the following recipes on our blog that might answer your question:\n\n`;
        
        blogRecipes.forEach((recipe, index) => {
          recipeContext += `Recipe ${index + 1}: "${recipe.title}"\n`;
          recipeContext += `Description: ${recipe.description || 'No description available'}\n`;
          if (recipe.keyIngredients?.length) {
            recipeContext += `Key ingredients: ${recipe.keyIngredients.join(', ')}\n\n`;
          }
        });
        
        recipeContext += `When answering, please reference these recipes from our blog first before generating your own recipes.`;
        
        // Add this to the system prompt
        systemPrompt += recipeContext;
      }
    }

    // Add recipe context if available
    if (recipeContext?.title) {
      systemPrompt += `\n\nThe user is currently working with a recipe for "${recipeContext.title}".`;
      
      if (recipeContext.ingredients?.length > 0) {
        systemPrompt += ` The recipe ingredients include: ${recipeContext.ingredients.join(', ')}.`;
      }
    }

    // Prepare messages array
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add previous chat history if available
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }
    
    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Call the OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return res.status(openaiResponse.status).json({ 
        error: 'Failed to get AI response', 
        details: errorData 
      });
    }

    const data = await openaiResponse.json();
    const response = data.choices[0].message.content;

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in AI assistant:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
