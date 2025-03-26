
import { logInfo, logError } from '@/utils/logger';
import { ContentItem } from './types';

/**
 * Handles loading and initializing content for the context-aware AI
 */
export class ContentInitializer {
  private contentIndex: ContentItem[] = [];
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  
  constructor() {
    this.contentIndex = [];
    this.isInitialized = false;
  }
  
  /**
   * Initialize the content index
   */
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
  
  /**
   * Get the loaded content index
   */
  public getContentIndex(): ContentItem[] {
    return this.contentIndex;
  }
  
  /**
   * Check if the service is initialized
   */
  public isReady(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Check if the service is in the process of initializing
   */
  public isInProgress(): boolean {
    return this.isInitializing;
  }
  
  /**
   * Load content from various sources
   */
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
