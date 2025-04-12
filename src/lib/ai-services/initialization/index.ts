

import { logInfo, logError } from '@/utils/logger';
import { initializeContentServices } from './content-services';
import { initializePDFServices } from './pdf-services';
import { initializeWebSockets } from './websocket';
import { verifyAPIKey } from '../key-management';
import { fixAriaAccessibility } from './accessibility';

/**
 * Initialize all AI services
 * This is the main entry point for initializing all AI-related services
 */
export const initializeAIService = async (): Promise<{
  contentIndexingAvailable: boolean;
  contextAwareAvailable: boolean;
  pdfWorkerAvailable: boolean;
  ocrAvailable: boolean;
  apiKeyConfigured: boolean;
}> => {
  logInfo('Initializing AI services...');

  // Initialize WebSockets first for real-time capabilities
  try {
    initializeWebSockets();
    logInfo('✅ WebSockets initialized');
  } catch (error) {
    logError('WebSockets initialization failed', { error });
  }

  // Initialize content services
  const { contentIndexingAvailable, contextAwareAvailable } = 
    await initializeContentServices().catch(error => {
      logError('Content services initialization failed', { error });
      return { contentIndexingAvailable: false, contextAwareAvailable: false };
    });

  // Initialize PDF services
  const { pdfWorkerAvailable, ocrAvailable } = 
    await initializePDFServices().catch(error => {
      logError('PDF services initialization failed', { error });
      return { pdfWorkerAvailable: false, ocrAvailable: false };
    });

  // Verify API key configuration
  const apiKeyConfigured = await verifyAPIKey().catch(() => false);

  // Fix accessibility issues
  try {
    fixAriaAccessibility();
    logInfo('✅ Accessibility fixes applied');
  } catch (error) {
    logError('Accessibility fixes failed', { error });
  }
  
  // Log initialization status
  const status = {
    contentIndexingAvailable,
    contextAwareAvailable,
    pdfWorkerAvailable,
    ocrAvailable,
    apiKeyConfigured
  };
  
  logInfo('AI service initialization complete', status);
  
  return status;
};

/**
 * Verify the status of AI services
 * This can be used to check if services are available after initialization
 */
export const verifyAIServiceStatus = async () => {
  return await initializeAIService();
};

// Re-export accessibility function
export { fixAriaAccessibility } from './accessibility';

