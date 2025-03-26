
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
      
      // Enhanced search with broader matching and better keyword extraction
      const searchResults = contentIndexer.search(query, {
        threshold: 0.5, // Increased threshold for broader matching
        includeScore: true,
        includeMatches: true,
        limit: 8  // Retrieve more results for better context
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
    
    // If no results found, try broader search terms
    if (searchResults.length === 0) {
      // Try to extract key terms for broader matching
      const keyTerms = this.extractKeyTerms(query);
      if (keyTerms) {
        const broadSearchResults = contentIndexer.search(keyTerms, {
          threshold: 0.6, // Even higher threshold for more permissive matching
          includeScore: true,
          limit: 3
        });
        
        if (broadSearchResults.length > 0) {
          searchResults = broadSearchResults;
        }
      }
    }
    
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
    
    // Generate a more natural sounding response
    const answer = this.generateNaturalResponse(query, topResult, searchResults);
    
    return {
      answer,
      sources,
      success: true
    };
  }
  
  /**
   * Generate a more natural sounding response for fallback mode
   */
  private generateNaturalResponse(query: string, topResult: SearchResult, allResults: SearchResult[]): string {
    const lowerQuery = query.toLowerCase();
    
    // For recipe queries
    if (lowerQuery.includes('recipe') || 
        lowerQuery.includes('how to make') || 
        lowerQuery.includes('bread')) {
      
      if (allResults.length > 1) {
        return `Based on your question about ${this.extractTopic(query)}, I found a few relevant recipes. "${topResult.item.title}" might be what you're looking for. ${topResult.item.excerpt} I also found ${allResults.length-1} other related recipes you might want to check out.`;
      } else {
        return `For your question about ${this.extractTopic(query)}, I found "${topResult.item.title}" which seems relevant. ${topResult.item.excerpt}`;
      }
    }
    
    // For technique or general baking queries
    if (lowerQuery.includes('how') || 
        lowerQuery.includes('technique') || 
        lowerQuery.includes('method')) {
      
      return `Regarding ${this.extractTopic(query)}, I found some information in "${topResult.item.title}". ${topResult.item.excerpt}`;
    }
    
    // Default response
    return `Based on our content, you might be interested in "${topResult.item.title}". ${topResult.item.excerpt}`;
  }
  
  /**
   * Extract the main topic from a query
   */
  private extractTopic(query: string): string {
    // Remove common question words and filler phrases
    const cleaned = query.toLowerCase()
      .replace(/^(what|how|why|when|where|do|can|could)\s+(is|are|do|does|did|was|were|can|could|would|should|to)\s+/g, '')
      .replace(/find me|can you find|are there|do you have|a recipe for|recipes for/g, '')
      .trim();
    
    // Return first few words as the topic if still long
    if (cleaned.length > 30) {
      const words = cleaned.split(' ');
      if (words.length > 5) {
        return words.slice(0, 4).join(' ') + '...';
      }
    }
    
    return cleaned;
  }
  
  /**
   * Extract key terms from a query for broader matching
   */
  private extractKeyTerms(query: string): string {
    // Convert query to lowercase
    const lowerQuery = query.toLowerCase();
    
    // Look for bread types
    const breadTypes = ['sourdough', 'challah', 'rye', 'focaccia', 'ciabatta', 'baguette', 'brioche'];
    for (const breadType of breadTypes) {
      if (lowerQuery.includes(breadType)) {
        return breadType;
      }
    }
    
    // Look for recipe names with possessive forms (e.g., "Henry's Foolproof")
    const possessiveMatch = query.match(/(\w+)'s\s+(\w+)/i);
    if (possessiveMatch) {
      return `${possessiveMatch[1]} ${possessiveMatch[2]}`;
    }
    
    // Extract just nouns and adjectives (simple approach)
    const words = lowerQuery.split(/\s+/);
    const stopWords = ['a', 'an', 'the', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 
                      'do', 'does', 'did', 'has', 'have', 'had', 'can', 'could', 'will', 'would', 
                      'should', 'may', 'might', 'must', 'for', 'and', 'or', 'but', 'if', 'because', 
                      'as', 'until', 'while', 'of', 'at', 'by', 'with', 'about', 'against', 'between', 
                      'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 
                      'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 
                      'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
                      'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 
                      'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 
                      'now', 'find', 'me', 'recipe', 'recipes'];
    
    const contentWords = words.filter(word => !stopWords.includes(word) && word.length > 3);
    
    if (contentWords.length > 0) {
      return contentWords.slice(0, 3).join(' ');
    }
    
    return '';
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
      const contextText = searchResults.slice(0, 6).map((result, index) => 
        `[Source ${index + 1}] "${result.item.title}" (Type: ${result.item.type}): ${result.item.excerpt}`
      ).join('\n\n');
      
      // Prepare sources for response
      const sources = searchResults.slice(0, 6).map(result => ({
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
      
      // Use OpenAI to generate a response based on our content with enhanced prompting
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
              content: `You are an expert baker and assistant for a bread baking website. 
              Answer the user's question based EXCLUSIVELY on the provided information.
              Use the sources to provide accurate information, and cite your sources as [Source X] where relevant. 
              If there are multiple sources that provide relevant information, synthesize them to provide a complete answer.
              If the provided sources don't contain enough information to fully answer the question, acknowledge that and share what information is available.
              Only provide information related to baking, bread, and cooking - if asked something outside this domain, gently redirect the conversation back to baking topics.
              Keep your response conversational, friendly and helpful, like an experienced baker sharing knowledge.`
            },
            {
              role: 'user',
              content: `Please answer this question based on the following information from our website's content:\n\n${contextText}\n\nQuestion: ${query}`
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
