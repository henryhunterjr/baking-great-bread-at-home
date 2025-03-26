
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
  private contentCategories: string[] = ['recipe', 'blog', 'technique', 'reference'];
  
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
      
      // Record content categories for search optimization
      try {
        const allContent = contentIndexer.getAllContent();
        const categories = new Set<string>();
        
        allContent.forEach(item => {
          if (item.type) {
            categories.add(item.type);
          }
        });
        
        this.contentCategories = Array.from(categories);
        logInfo('Context categories indexed', { categories: this.contentCategories });
      } catch (error) {
        logError('Error collecting content categories', { error });
        // Non-critical error, continue initialization
      }
      
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
      
      // Advanced multi-strategy search approach
      const searchResults = this.performMultiStrategySearch(query);
      
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
   * Multi-strategy search that combines multiple search techniques
   * for more accurate context retrieval
   */
  private performMultiStrategySearch(query: string): SearchResult[] {
    // Start with standard search
    let results = contentIndexer.search(query, {
      threshold: 0.4, // Lower threshold for better matching
      includeScore: true,
      includeMatches: true,
      limit: 10
    });
    
    // If few results, try with extracted key terms
    if (results.length < 3) {
      const keyTerms = this.extractKeyTerms(query);
      
      if (keyTerms) {
        const keyTermResults = contentIndexer.search(keyTerms, {
          threshold: 0.6,
          includeScore: true,
          limit: 5
        });
        
        // Merge results, avoiding duplicates
        const existingIds = new Set(results.map(r => r.item.id));
        for (const result of keyTermResults) {
          if (!existingIds.has(result.item.id)) {
            results.push(result);
            existingIds.add(result.item.id);
          }
        }
      }
    }
    
    // Add category-specific search if query matches known categories
    const categoryMatch = this.detectContentCategory(query);
    
    if (categoryMatch) {
      const categoryResults = contentIndexer.search(query, {
        threshold: 0.5,
        includeScore: true,
        limit: 10,
        // Filter by detected category
        filter: item => item.type === categoryMatch
      });
      
      // Merge results, avoiding duplicates
      const existingIds = new Set(results.map(r => r.item.id));
      for (const result of categoryResults) {
        if (!existingIds.has(result.item.id)) {
          results.push(result);
          existingIds.add(result.item.id);
        }
      }
    }
    
    // Sort by relevance (score)
    results.sort((a, b) => {
      const scoreA = a.score || 1;
      const scoreB = b.score || 1;
      return scoreA - scoreB;
    });
    
    // Limit to top results
    return results.slice(0, 10);
  }
  
  /**
   * Detect which content category the query might be related to
   */
  private detectContentCategory(query: string): string | null {
    const lowerQuery = query.toLowerCase();
    
    // Recipe detection
    if (lowerQuery.includes('recipe') || 
        lowerQuery.includes('bake') || 
        lowerQuery.includes('cook') ||
        lowerQuery.includes('ingredient') ||
        lowerQuery.includes('make') ||
        lowerQuery.includes('dough')) {
      return 'recipe';
    }
    
    // Technique detection
    if (lowerQuery.includes('technique') || 
        lowerQuery.includes('method') || 
        lowerQuery.includes('how to') ||
        lowerQuery.includes('steps for')) {
      return 'technique';
    }
    
    // Blog detection
    if (lowerQuery.includes('blog') || 
        lowerQuery.includes('article') || 
        lowerQuery.includes('post') ||
        lowerQuery.includes('wrote')) {
      return 'blog';
    }
    
    return null;
  }
  
  /**
   * Generate a response using OpenAI with context from our content
   */
  private async generateOpenAIResponse(query: string, searchResults: SearchResult[]): Promise<ContextAwareResponse> {
    logInfo('Generating AI response with context', { 
      query, 
      contextResults: searchResults.length 
    });
    
    try {
      // Format search results as context
      const context = this.formatSearchResultsAsContext(searchResults);
      
      // If we have no context, generate a response indicating limited knowledge
      if (!context) {
        return {
          answer: "I don't have specific information about that in my knowledge base. I can help with general bread baking questions, but for this specific query, I don't have relevant sources to reference.",
          sources: [],
          success: true
        };
      }
      
      // Format sources for the response
      const sources = searchResults.slice(0, 5).map(result => ({
        title: result.item.title,
        excerpt: result.item.excerpt,
        url: result.item.url,
        type: result.item.type
      }));
      
      // In a real implementation, this would call the OpenAI API
      // For this example, we'll generate a simulated response
      const simulatedResponse = this.generateSimulatedResponse(query, searchResults);
      
      return {
        answer: simulatedResponse,
        sources,
        success: true
      };
    } catch (error) {
      logError('Error generating OpenAI response', { error });
      
      // Fall back to a simpler response
      return this.generateFallbackResponse(query, searchResults);
    }
  }
  
  /**
   * Format search results as context for the AI
   */
  private formatSearchResultsAsContext(searchResults: SearchResult[]): string | null {
    if (searchResults.length === 0) {
      return null;
    }
    
    let context = "Here's relevant information from our content:\n\n";
    
    // Add the top results as context
    searchResults.slice(0, 5).forEach((result, index) => {
      context += `[Source ${index + 1}: ${result.item.title}]\n`;
      context += `${result.item.excerpt}\n\n`;
    });
    
    return context;
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
   * Generate a simulated AI response for demonstration purposes
   */
  private generateSimulatedResponse(query: string, searchResults: SearchResult[]): string {
    if (searchResults.length === 0) {
      return "I don't have specific information about that in my knowledge base. I can help with general bread baking questions, but for this specific query, I don't have relevant sources to reference.";
    }
    
    const lowerQuery = query.toLowerCase();
    const topResult = searchResults[0];
    
    // Recipe-related response
    if (lowerQuery.includes('recipe') || 
        lowerQuery.includes('how to make') || 
        lowerQuery.includes('bread')) {
      
      return `Based on our recipes, ${topResult.item.title} would be a great option for ${this.extractTopic(query)}. ${topResult.item.excerpt} The key ingredients include flour, water, salt, and yeast. You'll want to follow proper mixing, proofing, and baking techniques for the best results. Would you like more specific details about any part of this recipe?`;
    }
    
    // Technique-related response
    if (lowerQuery.includes('how') || 
        lowerQuery.includes('technique') || 
        lowerQuery.includes('method')) {
      
      return `For ${this.extractTopic(query)}, the most important thing to understand is ${topResult.item.excerpt} This technique is used in many of our recipes, including ${searchResults.length > 1 ? searchResults[1].item.title : 'several of our popular breads'}. The key to success is patience and practice - don't be discouraged if it takes a few attempts to master!`;
    }
    
    // Default informative response
    return `From my knowledge base, I can tell you that ${topResult.item.excerpt} This information comes from "${topResult.item.title}" and is particularly relevant to your question about ${this.extractTopic(query)}. Let me know if you'd like more specific details on any aspect of this topic.`;
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
                      'do', 'does', 'did', 'has', 'have', 'had', 'can', 'could', 'would', 'should'];
    
    const filteredWords = words.filter(word => !stopWords.includes(word) && word.length > 3);
    
    if (filteredWords.length > 0) {
      // Return the top 3 longest words which are likely more specific
      return filteredWords
        .sort((a, b) => b.length - a.length)
        .slice(0, 3)
        .join(' ');
    }
    
    return query; // Fallback to original query
  }
}

// Singleton instance
export const contextAwareAI = ContextAwareAIService.getInstance();

// Initialization function
export const initializeContextAwareAI = async (): Promise<void> => {
  try {
    await contextAwareAI.initialize();
  } catch (error) {
    logError('Failed to initialize context-aware AI', { error });
    throw error;
  }
};
