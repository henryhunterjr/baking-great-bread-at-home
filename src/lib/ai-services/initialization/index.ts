
import { logInfo, logError } from '@/utils/logger';
import { initializeAPIKey } from './api-key';
import { initializePDFServices } from './pdf-services';
import { initializeContentServices } from './content-services';
import { initializeWebSockets, getWebSocketManager } from './websocket';
import { registerAccessibilityFixes } from './accessibility';

/**
 * Initialize AI service and content indexing with enhanced reliability
 */
export const initializeAIService = async (): Promise<void> => {
  try {
    logInfo('Initializing AI service');
    
    // Initialize API key
    const apiKeyStatus = await initializeAPIKey();
    
    // Initialize PDF services
    const pdfStatus = await initializePDFServices();
    
    // Initialize content services
    const contentStatus = await initializeContentServices();
    
    // Initialize WebSockets
    initializeWebSockets();
    
    // Register accessibility fixes
    registerAccessibilityFixes();
    
    logInfo('AI service initialization complete', {
      apiConfigured: apiKeyStatus.isConfigured,
      apiValid: apiKeyStatus.isValid,
      pdfWorker: pdfStatus.pdfWorkerAvailable,
      ocr: pdfStatus.ocrAvailable,
      contentIndexing: contentStatus.contentIndexingAvailable,
      contextAware: contentStatus.contextAwareAvailable
    });
  } catch (error) {
    logError('Failed to initialize AI service', { error });
  }
};

/**
 * Verify AI service status with comprehensive diagnostics
 */
export const verifyAIServiceStatus = async (): Promise<{
  apiKeyValid: boolean;
  pdfWorkerAvailable: boolean;
  ocrAvailable: boolean;
  contentIndexingAvailable: boolean;
  websocketConnected: boolean;
  overallStatus: boolean;
}> => {
  try {
    // Initialize API key
    const apiKeyStatus = await initializeAPIKey();
    
    // Initialize PDF services
    const pdfStatus = await initializePDFServices();
    
    // Initialize content services
    const contentStatus = await initializeContentServices();
    
    // Check WebSocket connection
    const websocketManager = getWebSocketManager();
    const websocketConnected = !!websocketManager && !websocketManager.isFallbackMode();
    
    // Determine overall status (API key not required for overall status)
    const overallStatus = pdfStatus.pdfWorkerAvailable && 
      (pdfStatus.ocrAvailable || contentStatus.contentIndexingAvailable);
    
    const statusReport = {
      apiKeyValid: !!apiKeyStatus.isValid,
      pdfWorkerAvailable: pdfStatus.pdfWorkerAvailable,
      ocrAvailable: pdfStatus.ocrAvailable,
      contentIndexingAvailable: contentStatus.contentIndexingAvailable,
      websocketConnected,
      overallStatus
    };
    
    logInfo('AI service status verification complete', statusReport);
    return statusReport;
  } catch (error) {
    logError('Error verifying AI service status', { error });
    return {
      apiKeyValid: false,
      pdfWorkerAvailable: false,
      ocrAvailable: false,
      contentIndexingAvailable: false,
      websocketConnected: false,
      overallStatus: false
    };
  }
};

// Re-export accessibility functions
export { fixAriaAccessibility } from './accessibility';
