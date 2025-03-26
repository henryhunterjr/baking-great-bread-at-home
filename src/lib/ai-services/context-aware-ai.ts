
import { logInfo, logError } from '@/utils/logger';
import { contentIndexer, initializeContentIndexer } from './content-indexing/content-indexer';
import { AI_CONFIG, getOpenAIApiKey, isOpenAIConfigured } from './ai-config';
import { SearchResult } from './content-indexing/types';

/**
 * Interface for context-aware AI responses
 */
export interface ContextAwareResponse {
  answer: string;
  sources: Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
  }>;
  success: boolean;
  error?: string;
}

/**
 * Context-aware AI service that uses content indexing to enhance responses
 */
export class ContextAwareAIService {
  private static instance: ContextAwareAIService;
  private isInitialized = false;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): ContextAwareAIService {
    if (!ContextAwareAIService.instance) {
      ContextAwareAIService.instance = new ContextAwareAIService();
    }
    return ContextAwareAIService.instance;
  }
  
  /**
   * Initialize the context-aware AI service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    try {
      logInfo('Initializing context-aware AI service');
      
      // Make sure content indexer is initialized
      await initializeContentIndexer();
      
      this.isInitialized = true;
      logInfo('Context-aware AI service initialized successfully');
    } catch (error) {
      logError('Failed to initialize context-aware AI service', { error });
      throw new Error('Failed to initialize context-aware AI service');
    }
  }
  
  /**
   * Process a query with context awareness
   */
  public async processQuery(query: string): Promise<ContextAwareResponse> {
    if (!this.isInitialized) {
      try {
        await this.initialize();
      } catch (error) {
        return {
          answer: "I'm having trouble accessing my knowledge base. Please try again later.",
          sources: [],
          success: false,
          error: 'Service not initialized'
        };
      }
    }
    
    try {
      logInfo('Processing context-aware query', { query });
      
      // Search for relevant content
      const searchResults = contentIndexer.search(query, {
        threshold: 0.4,
        includeScore: true,
        includeMatches: true
      });
      
      if (!isOpenAIConfigured()) {
        return this.generateFallbackResponse(query, searchResults);
      }
      
      // Generate AI response with context
      const aiResponse = await this.generateOpenAIResponse(query, searchResults);
      
      return aiResponse;
    } catch (error) {
      logError('Error processing context-aware query', { error, query });
      
      return {
        answer: "I encountered an error while processing your question. Please try again later.",
        sources: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Generate a fallback response when OpenAI is not configured
   */
  private generateFallbackResponse(query: string, searchResults: SearchResult[]): ContextAwareResponse {
    logInfo('Generating fallback response', { 
      query, 
      resultsCount: searchResults.length 
    });
    
    if (searchResults.length === 0) {
      return {
        answer: "I don't have enough information to answer that question. Please try a different question about our recipes, baking techniques, or bread-making processes.",
        sources: [],
        success: true
      };
    }
    
    // Use the top search result as the answer
    const topResult = searchResults[0];
    
    // Format the top 3 results as sources
    const sources = searchResults.slice(0, 3).map(result => ({
      title: result.item.title,
      excerpt: result.item.excerpt,
      url: result.item.url,
      type: result.item.type
    }));
    
    return {
      answer: `Based on our content, you might be interested in "${topResult.item.title}". ${topResult.item.excerpt}`,
      sources,
      success: true
    };
  }
  
  /**
   * Generate an AI response using OpenAI API with context from search results
   */
  private async generateOpenAIResponse(query: string, searchResults: SearchResult[]): Promise<ContextAwareResponse> {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      return this.generateFallbackResponse(query, searchResults);
    }
    
    try {
      logInfo('Generating OpenAI response with context', { 
        query, 
        resultsCount: searchResults.length 
      });
      
      // Prepare context from search results
      const contextText = searchResults.slice(0, 5).map((result, index) => 
        `[Source ${index + 1}] "${result.item.title}": ${result.item.excerpt}`
      ).join('\n\n');
      
      // Prepare sources for response
      const sources = searchResults.slice(0, 5).map(result => ({
        title: result.item.title,
        excerpt: result.item.excerpt,
        url: result.item.url,
        type: result.item.type
      }));
      
      // If we don't have any relevant content, use a more generic response
      if (searchResults.length === 0) {
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
                content: 'You are an assistant for a bread baking website. Provide helpful information about baking, bread, and related topics. Only provide information related to baking, bread, and cooking - if asked something outside this domain, gently redirect the conversation back to baking topics.'
              },
              {
                role: 'user',
                content: query
              }
            ],
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const answer = data.choices[0]?.message?.content || "I don't have specific information about that in my knowledge base.";
        
        return {
          answer,
          sources: [],
          success: true
        };
      }
      
      // Use OpenAI to generate a response based on our content
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
              content: `You are an assistant for a bread baking website. Answer the user's question based EXCLUSIVELY on the provided information. Use the sources to provide accurate information, and cite your sources as [Source X] where relevant. If the provided sources don't contain enough information to fully answer the question, acknowledge that and share what information is available. Only provide information related to baking, bread, and cooking - if asked something outside this domain, gently redirect the conversation back to baking topics.`
            },
            {
              role: 'user',
              content: `Please answer this question based on the following information about our website's content:\n\n${contextText}\n\nQuestion: ${query}`
            }
          ],
          temperature: 0.5
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const answer = data.choices[0]?.message?.content || "I'm having trouble processing your request.";
      
      return {
        answer,
        sources,
        success: true
      };
    } catch (error) {
      logError('Error generating OpenAI response', { error, query });
      
      // Fall back to basic response if OpenAI fails
      return this.generateFallbackResponse(query, searchResults);
    }
  }
}

// Export singleton instance
export const contextAwareAI = ContextAwareAIService.getInstance();

// Export initialization function
export const initializeContextAwareAI = async (): Promise<void> => {
  await contextAwareAI.initialize();
};
