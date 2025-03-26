
import { logInfo, logError } from '@/utils/logger';
import { 
  verifyAPIKey, 
  isOpenAIConfigured, 
  updateOpenAIApiKey, 
  checkAPIKeyStatus 
} from './ai-config';
import { initializeContentIndexer } from './content-indexing/content-indexer';
import { initializeContextAwareAI } from './context-aware-ai';

/**
 * Initialize AI service and content indexing
 */
export const initializeAIService = async (): Promise<void> => {
  try {
    logInfo('Initializing AI service');
    
    // Make sure we have the latest API key from localStorage
    updateOpenAIApiKey();
    
    // Check and log detailed API key status
    const keyStatus = checkAPIKeyStatus();
    logInfo('API Key Status during initialization', keyStatus);
    
    // Verify the API key
    const isConfigured = isOpenAIConfigured();
    const isValid = isConfigured ? await verifyAPIKey() : false;
    
    if (isValid) {
      logInfo('✅ AI Service initialized with valid API key');
    } else {
      if (isConfigured) {
        logInfo('⚠️ API key found but validation failed. The key may be invalid.');
      } else {
        logInfo('⚠️ AI Service initialized without API key');
      }
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
    // Make sure we have the latest key
    updateOpenAIApiKey(); 
    
    // Log detailed API key status
    const keyStatus = checkAPIKeyStatus();
    logInfo('API Key Status during verification', keyStatus);
    
    // Attempt to verify the API key
    const isValid = await verifyAPIKey();
    
    logInfo('AI service status verification', { isValid });
    return isValid;
  } catch (error) {
    logError('Error verifying AI service status', { error });
    return false;
  }
};
