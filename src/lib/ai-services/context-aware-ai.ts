
import { logInfo, logError } from '@/utils/logger';
import { getOpenAIApiKey } from './ai-config';
import { ContentInitializer } from './context-aware/initialization';
import { ContentSearchEngine } from './context-aware/search';
import { AIProcessor } from './context-aware/processing';
import { ContextAwareResponse } from './context-aware/types';

// Re-export the response type
export { ContextAwareResponse } from './context-aware/types';

// Context-aware AI service
class ContextAwareAI {
  private contentInitializer: ContentInitializer;
  private searchEngine: ContentSearchEngine | null = null;
  private aiProcessor: AIProcessor;
  
  constructor() {
    this.contentInitializer = new ContentInitializer();
    this.aiProcessor = new AIProcessor();
  }
  
  // Initialize the content index
  public async initialize(): Promise<boolean> {
    try {
      const initialized = await this.contentInitializer.initialize();
      
      if (initialized) {
        // Initialize search engine with content index
        this.searchEngine = new ContentSearchEngine(this.contentInitializer.getContentIndex());
      }
      
      return initialized;
    } catch (error) {
      logError('Failed to initialize context-aware AI', { error });
      return false;
    }
  }
  
  // Process a user query with relevant context
  public async processQuery(query: string): Promise<ContextAwareResponse> {
    try {
      if (!this.contentInitializer.isReady()) {
        await this.initialize();
      }
      
      // Check if OpenAI API key is available
      const apiKey = getOpenAIApiKey();
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      
      if (!this.searchEngine) {
        throw new Error("Search engine not initialized");
      }
      
      // Perform search to retrieve relevant context
      const relevantContext = await this.searchEngine.searchContent(query);
      
      // Prepare system prompt with context
      const systemPrompt = this.aiProcessor.prepareSystemPrompt(relevantContext.items);
      
      // Send request to OpenAI
      const openaiResponse = await this.aiProcessor.sendRequestToOpenAI(systemPrompt, query);
      
      // Process sources for citation
      const sources = this.searchEngine.formatSourcesForCitation(relevantContext.items);
      
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
}

// Export a singleton instance
export const contextAwareAI = new ContextAwareAI();

// Initialize function for use in the application
export const initializeContextAwareAI = async (): Promise<boolean> => {
  return await contextAwareAI.initialize();
};
