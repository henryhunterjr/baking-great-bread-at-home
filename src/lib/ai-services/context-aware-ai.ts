
import { logInfo, logError } from '@/utils/logger';
import { AI_CONFIG, getOpenAIApiKey } from './ai-config';

// Types for the content index
interface ContentItem {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'blog' | 'recipe' | 'book' | 'faq';
  tags?: string[];
}

interface ContentIndexOptions {
  sources?: string[];
  tags?: string[];
  limit?: number;
}

interface SearchResult {
  items: ContentItem[];
  total: number;
}

interface ContextAwareAIResponse {
  success: boolean;
  answer: string;
  error?: string;
  sources?: Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
  }>;
}

// Context-aware AI service
class ContextAwareAI {
  private contentIndex: ContentItem[] = [];
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  
  constructor() {
    this.contentIndex = [];
    this.isInitialized = false;
  }
  
  // Initialize the content index
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.isInitializing) return false;
    
    try {
      this.isInitializing = true;
      logInfo('Initializing context-aware AI service');
      
      // Load content from sources
      await this.loadContentFromSources();
      
      this.isInitialized = true;
      this.isInitializing = false;
      
      logInfo(`Context-aware AI initialized with ${this.contentIndex.length} content items`);
      return true;
    } catch (error) {
      this.isInitialized = false;
      this.isInitializing = false;
      logError('Failed to initialize context-aware AI', { error });
      return false;
    }
  }
  
  // Process a user query with relevant context
  public async processQuery(query: string): Promise<ContextAwareAIResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Check if OpenAI API key is available
      const apiKey = getOpenAIApiKey();
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      
      // Perform search to retrieve relevant context
      const relevantContext = await this.searchContent(query);
      
      // Prepare system prompt with context
      const systemPrompt = this.prepareSystemPrompt(relevantContext.items);
      
      // Send request to OpenAI
      const openaiResponse = await this.sendRequestToOpenAI(systemPrompt, query);
      
      // Process sources for citation
      const sources = relevantContext.items.map(item => ({
        title: item.title,
        excerpt: this.getExcerpt(item.content, 120),
        url: item.url,
        type: item.type
      }));
      
      return {
        success: true,
        answer: openaiResponse,
        sources: sources.length > 0 ? sources : undefined
      };
    } catch (error) {
      logError('Error processing query with context-aware AI', { error, query });
      return {
        success: false,
        answer: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Search the content index for relevant context
  private async searchContent(query: string, options?: ContentIndexOptions): Promise<SearchResult> {
    const defaultOptions: ContentIndexOptions = {
      limit: 3
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // For now, we'll use a simple search algorithm
    let results = this.contentIndex
      .filter(item => {
        // If sources are specified, filter by source type
        if (mergedOptions.sources && mergedOptions.sources.length > 0) {
          if (!mergedOptions.sources.includes(item.type)) {
            return false;
          }
        }
        
        // If tags are specified, filter by tags
        if (mergedOptions.tags && mergedOptions.tags.length > 0) {
          if (!item.tags || !item.tags.some(tag => mergedOptions.tags!.includes(tag))) {
            return false;
          }
        }
        
        // Search in title and content
        const normalizedQuery = query.toLowerCase();
        const normalizedTitle = item.title.toLowerCase();
        const normalizedContent = item.content.toLowerCase();
        
        return normalizedTitle.includes(normalizedQuery) || 
               normalizedContent.includes(normalizedQuery);
      })
      .slice(0, mergedOptions.limit);
      
    // If no results, try a more lenient search
    if (results.length === 0) {
      const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      
      results = this.contentIndex
        .filter(item => {
          const normalizedTitle = item.title.toLowerCase();
          const normalizedContent = item.content.toLowerCase();
          
          // Check if any of the significant words are in the content
          return queryWords.some(word => 
            normalizedTitle.includes(word) || normalizedContent.includes(word)
          );
        })
        .slice(0, mergedOptions.limit);
    }
    
    return {
      items: results,
      total: results.length
    };
  }
  
  // Get a short excerpt from content
  private getExcerpt(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    
    const excerpt = content.substring(0, maxLength);
    return excerpt + '...';
  }
  
  // Prepare system prompt with context
  private prepareSystemPrompt(contextItems: ContentItem[]): string {
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
  
  // Send request to OpenAI
  private async sendRequestToOpenAI(systemPrompt: string, userQuery: string): Promise<string> {
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
  
  // Load content from various sources
  private async loadContentFromSources(): Promise<void> {
    try {
      // For now, just load some dummy content
      // In a real implementation, this would fetch content from blogs, recipes, etc.
      this.contentIndex = [
        {
          id: '1',
          title: "Henry's Foolproof Sourdough",
          content: "This is Henry's famous foolproof sourdough recipe. It involves a simple overnight process with minimal handling. The key is using a mature starter and maintaining proper hydration levels.",
          url: '/blog/henrys-foolproof-sourdough',
          type: 'recipe'
        },
        {
          id: '2',
          title: 'The Science of Sourdough Fermentation',
          content: 'Sourdough fermentation is a complex process involving wild yeast and lactic acid bacteria. The fermentation creates the distinct sour flavor and helps develop the gluten structure.',
          url: '/blog/sourdough-fermentation-science',
          type: 'blog'
        },
        {
          id: '3',
          title: 'Challah Bread: A Traditional Recipe',
          content: 'Challah is a special Jewish bread made for Sabbath and holidays. The dough is enriched with eggs and oil, and traditionally braided before baking.',
          url: '/blog/traditional-challah-recipe',
          type: 'recipe',
          tags: ['jewish', 'holiday']
        }
      ];
      
      logInfo(`Loaded ${this.contentIndex.length} content items`);
    } catch (error) {
      logError('Error loading content from sources', { error });
      throw error;
    }
  }
}

// Export a singleton instance
export const contextAwareAI = new ContextAwareAI();

// Initialize function for use in the application
export const initializeContextAwareAI = async (): Promise<boolean> => {
  return await contextAwareAI.initialize();
};
