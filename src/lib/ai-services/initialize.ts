
import { logInfo, logError } from '@/utils/logger';
import { verifyAPIKey } from './ai-config';
import { initializeContentIndexer } from './content-indexing/content-indexer';
import { initializeContextAwareAI } from './context-aware-ai';

/**
 * Initialize AI service and content indexing
 */
export const initializeAIService = async (): Promise<void> => {
  try {
    logInfo('Initializing AI service');
    
    // Verify the API key
    const isValid = await verifyAPIKey();
    
    if (isValid) {
      logInfo('✅ AI Service initialized with valid API key');
    } else {
      logInfo('⚠️ AI Service initialized without valid API key');
    }
    
    // Initialize content indexing
    try {
      await initializeContentIndexer();
      logInfo('✅ Content indexing initialized');
    } catch (error) {
      logError('Error initializing content indexing', { error });
    }
    
    // Initialize context-aware AI
    try {
      await initializeContextAwareAI();
      logInfo('✅ Context-aware AI initialized');
    } catch (error) {
      logError('Error initializing context-aware AI', { error });
    }
    
  } catch (error) {
    logError('Failed to initialize AI service', { error });
  }
};

/**
 * Verify AI service status
 */
export const verifyAIServiceStatus = async (): Promise<boolean> => {
  try {
    // Attempt to verify the API key
    const isValid = await verifyAPIKey();
    
    return isValid;
  } catch (error) {
    logError('Error verifying AI service status', { error });
    return false;
  }
};
