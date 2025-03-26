
import { logError } from '@/utils/logger';
import { AI_CONFIG, getOpenAIApiKey } from '../ai-config';
import { ContentItem, ContextAwareResponse } from './types';

/**
 * Handles AI request processing and response generation
 */
export class AIProcessor {
  /**
   * Prepare system prompt with context
   */
  public prepareSystemPrompt(contextItems: ContentItem[]): string {
    const baseSystemPrompt = `
      You are a helpful assistant specializing in bread baking and recipes.
      You provide accurate information based on the knowledge provided to you.
      Always cite your sources when providing information from specific recipes or blog posts.
      If you don't know something, admit it rather than making up an answer.
    `;
    
    if (contextItems.length === 0) {
      return baseSystemPrompt;
    }
    
    // Add context items to the system prompt
    const contextPrompt = contextItems.map(item => `
      Source Title: ${item.title}
      Source Type: ${item.type}
      Content: ${item.content.substring(0, 1000)}${item.content.length > 1000 ? '...' : ''}
      URL: ${item.url}
    `).join('\n\n');
    
    return `
      ${baseSystemPrompt}
      
      Use the following sources to answer the user's query:
      
      ${contextPrompt}
    `;
  }
  
  /**
   * Send request to OpenAI
   */
  public async sendRequestToOpenAI(systemPrompt: string, userQuery: string): Promise<string> {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      throw new Error("API key not configured");
    }
    
    try {
      const response = await fetch(`${AI_CONFIG.openai.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      logError('Error communicating with OpenAI', { error });
      throw error;
    }
  }
}
