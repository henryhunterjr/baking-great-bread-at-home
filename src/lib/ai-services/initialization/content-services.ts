
import { logInfo, logError } from '@/utils/logger';
import { initializeContentIndexer } from '../content-indexing/content-indexer';
import { initializeContextAwareAI } from '../context-aware-ai';

/**
 * Initialize content indexing and context-aware AI
 */
export const initializeContentServices = async (): Promise<{
  contentIndexingAvailable: boolean;
  contextAwareAvailable: boolean;
}> => {
  let contentIndexingAvailable = false;
  let contextAwareAvailable = false;
  
  // Initialize content indexing with improved error handling
  try {
    await initializeContentIndexer();
    logInfo('✅ Content indexing initialized');
    contentIndexingAvailable = true;
  } catch (error) {
    logError('Error initializing content indexing', { error });
  }
  
  // Initialize context-aware AI with improved error handling
  try {
    await initializeContextAwareAI();
    logInfo('✅ Context-aware AI initialized');
    contextAwareAvailable = true;
  } catch (error) {
    logError('Error initializing context-aware AI', { error });
  }
  
  return { contentIndexingAvailable, contextAwareAvailable };
};
