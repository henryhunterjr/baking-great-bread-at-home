
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
import { verifyOCRAvailability } from './pdf/ocr/ocr-processor';
import { createWebSocketManager } from '@/utils/websocket-manager';

// WebSocket connection if needed
let websocketManager: ReturnType<typeof createWebSocketManager> | null = null;

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
    
    // Initialize WebSocket connection if needed (with fallback support)
    try {
      if (window.location.hostname !== 'localhost' && !import.meta.env.VITE_DISABLE_WEBSOCKET) {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}`;
        
        websocketManager = createWebSocketManager(wsUrl)
          .onConnect(() => {
            logInfo(websocketManager?.isFallbackMode() 
              ? '⚠️ WebSocket connection failed, using fallback mode' 
              : '✅ WebSocket connected successfully');
          })
          .onError((error) => {
            logError('WebSocket error', { error });
          });
          
        websocketManager.connect();
      } else {
        logInfo('WebSocket initialization skipped (localhost or disabled)');
      }
    } catch (error) {
      logError('Error initializing WebSocket', { error });
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
  websocketConnected: boolean;
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
    
    // Check WebSocket connection
    const websocketConnected = !!websocketManager && !websocketManager.isFallbackMode();
    
    // Determine overall status (API key not required for overall status)
    const overallStatus = pdfWorkerAvailable && (ocrAvailable || contentIndexingAvailable);
    
    const statusReport = {
      apiKeyValid,
      pdfWorkerAvailable,
      ocrAvailable, 
      contentIndexingAvailable,
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

// Fix for ARIA accessibility issue with nav elements
export const fixAriaAccessibility = (): void => {
  try {
    // Find elements with aria-hidden="true" that might contain focusable elements
    const ariaHiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    
    ariaHiddenElements.forEach(el => {
      // Check if this element contains any focusable elements
      const focusableElements = el.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      if (focusableElements.length > 0) {
        // Apply inert attribute instead of aria-hidden for better accessibility
        el.setAttribute('inert', '');
        el.removeAttribute('aria-hidden');
        
        logInfo('Fixed ARIA accessibility issue', { 
          element: el.tagName, 
          focusableCount: focusableElements.length 
        });
      }
    });
  } catch (error) {
    logError('Error fixing ARIA accessibility', { error });
  }
};

// Run accessibility fixes on DOM content loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', fixAriaAccessibility);
}
