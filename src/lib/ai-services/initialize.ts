
import { logInfo, logError } from '@/utils/logger';
import { 
  verifyAPIKey, 
  isOpenAIConfigured, 
  updateOpenAIApiKey, 
  checkAPIKeyStatus 
} from './ai-config';
import { initializeContentIndexer } from './content-indexing/content-indexer';
import { initializeContextAwareAI } from './context-aware-ai';
import { ensurePDFWorkerFiles, configurePDFWorkerCORS } from './pdf/pdf-worker-service';
import { verifyOCRAvailability } from './pdf/ocr-processor';

/**
 * Initialize AI service and content indexing with enhanced reliability
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
    
    // Initialize PDF worker files
    try {
      await ensurePDFWorkerFiles();
      configurePDFWorkerCORS();
      logInfo('✅ PDF worker service initialized');
    } catch (error) {
      logError('Error initializing PDF worker service', { error });
    }
    
    // Verify OCR availability
    try {
      const ocrAvailable = await verifyOCRAvailability();
      if (ocrAvailable) {
        logInfo('✅ OCR service initialized');
      } else {
        logError('OCR service initialization failed', { 
          error: 'Tesseract.js not available or initialization error'
        });
      }
    } catch (error) {
      logError('Error verifying OCR availability', { error });
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
 * Verify AI service status with comprehensive diagnostics
 */
export const verifyAIServiceStatus = async (): Promise<{
  apiKeyValid: boolean;
  pdfWorkerAvailable: boolean;
  ocrAvailable: boolean;
  contentIndexingAvailable: boolean;
  overallStatus: boolean;
}> => {
  try {
    // Make sure we have the latest key
    updateOpenAIApiKey(); 
    
    // Log detailed API key status
    const keyStatus = checkAPIKeyStatus();
    logInfo('API Key Status during verification', keyStatus);
    
    // Attempt to verify the API key
    const apiKeyValid = await verifyAPIKey();
    
    // Check PDF worker availability
    const pdfWorkerAvailable = await ensurePDFWorkerFiles().then(() => true).catch(() => false);
    
    // Check OCR availability
    const ocrAvailable = await verifyOCRAvailability();
    
    // Check content indexing
    let contentIndexingAvailable = false;
    try {
      await initializeContentIndexer();
      contentIndexingAvailable = true;
    } catch (error) {
      logError('Content indexing verification failed', { error });
    }
    
    // Determine overall status (API key not required for overall status)
    const overallStatus = pdfWorkerAvailable && (ocrAvailable || contentIndexingAvailable);
    
    const statusReport = {
      apiKeyValid,
      pdfWorkerAvailable,
      ocrAvailable, 
      contentIndexingAvailable,
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
      overallStatus: false
    };
  }
};
