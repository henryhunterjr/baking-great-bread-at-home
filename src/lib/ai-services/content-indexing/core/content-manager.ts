
import { logInfo } from '@/utils/logger';
import { IndexedContent, ContentType } from '../types';

/**
 * Content Manager
 * Handles adding, updating, removing, and retrieving content from the index
 */
export class ContentManager {
  constructor(private contentIndex: IndexedContent[]) {}
  
  /**
   * Add or update a content item in the index
   */
  public addOrUpdateContent(content: IndexedContent): void {
    const existingIndex = this.contentIndex.findIndex(item => 
      item.id === content.id && item.type === content.type
    );
    
    if (existingIndex >= 0) {
      this.contentIndex[existingIndex] = content;
    } else {
      this.contentIndex.push(content);
    }
    
    logInfo('Content index updated', { id: content.id, type: content.type });
  }
  
  /**
   * Remove a content item from the index
   */
  public removeContent(id: string, type: ContentType): void {
    this.contentIndex = this.contentIndex.filter(
      item => !(item.id === id && item.type === type)
    );
    
    logInfo('Content removed from index', { id, type });
  }
  
  /**
   * Get all indexed content
   */
  public getAllContent(): IndexedContent[] {
    return [...this.contentIndex];
  }
  
  /**
   * Get content by type
   */
  public getContentByType(type: ContentType): IndexedContent[] {
    return this.contentIndex.filter(item => item.type === type);
  }
  
  /**
   * Get content by tags
   */
  public getContentByTags(tags: string[]): IndexedContent[] {
    return this.contentIndex.filter(item => 
      tags.some(tag => item.tags.includes(tag))
    );
  }
}
