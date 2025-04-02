
import { NextApiRequest, NextApiResponse } from 'next';
import { RecipeData } from '../src/types/recipeTypes';
import { ChatMessage } from '../src/components/recipe-converter/types/chat';

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

    // Construct the prompt with context
    let systemPrompt = 'You are a helpful cooking and recipe assistant. Provide concise, practical advice about cooking, baking, and recipes.';
    
    // Add recipe context if available
    if (recipeContext?.title) {
      systemPrompt += ` The user is currently working with a recipe for "${recipeContext.title}".`;
      
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
