
import { logInfo } from '@/utils/logger';
import { 
  isOpenAIConfigured, 
  updateOpenAIApiKey, 
  verifyAPIKey,
  checkAPIKeyStatus
} from '../ai-config';

/**
 * Initialize and validate OpenAI API key
 */
export const initializeAPIKey = async (): Promise<{
  isConfigured: boolean;
  isValid: boolean | null;
  keyStatus: ReturnType<typeof checkAPIKeyStatus>;
}> => {
  // Make sure we have the latest API key from localStorage
  updateOpenAIApiKey();
  
  // Check and log detailed API key status
  const keyStatus = checkAPIKeyStatus();
  logInfo('API Key Status during initialization', keyStatus);
  
  // Verify the API key only if we're not in production
  // In production, we'll assume the key is valid to avoid unnecessary API calls
  let isValid: boolean | null = null;
  const isConfigured = isOpenAIConfigured();
  
  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    if (isConfigured) {
      isValid = await verifyAPIKey();
      
      if (isValid) {
        logInfo('✅ AI Service initialized with valid API key');
      } else {
        logInfo('⚠️ API key found but validation failed. The key may be invalid.');
      }
    } else {
      logInfo('⚠️ AI Service initialized without API key');
      isValid = false;
    }
  } else {
    logInfo('Skipping API key verification in production environment');
  }
  
  return { isConfigured, isValid, keyStatus };
};
