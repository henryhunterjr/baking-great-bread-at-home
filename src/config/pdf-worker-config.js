
/**
 * PDF Worker configuration
 * This file centralizes PDF worker settings
 */

export const PDF_WORKER_CONFIG = {
  workerSrc: '/pdf.worker.min.js',
  fallbackWorkerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  cmapsUrl: '/cmaps/',
  cmapsPacked: true
};

// Helper to check if a worker is available
export const checkWorkerAvailability = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Worker not available at ${url}`);
    return false;
  }
};

// Get the effective worker URL, trying local first then fallback
export const getEffectiveWorkerUrl = async () => {
  try {
    const localWorkerAvailable = await checkWorkerAvailability(PDF_WORKER_CONFIG.workerSrc);
    return localWorkerAvailable ? 
      PDF_WORKER_CONFIG.workerSrc : 
      PDF_WORKER_CONFIG.fallbackWorkerSrc;
  } catch (error) {
    console.warn('Error checking worker availability, using fallback', error);
    return PDF_WORKER_CONFIG.fallbackWorkerSrc;
  }
};

// Helper to verify both local and fallback workers
export const verifyWorkers = async () => {
  const results = {
    local: false,
    fallback: false
  };
  
  try {
    results.local = await checkWorkerAvailability(PDF_WORKER_CONFIG.workerSrc);
    console.log(`Local PDF worker available: ${results.local}`);
    
    if (!results.local) {
      results.fallback = await checkWorkerAvailability(PDF_WORKER_CONFIG.fallbackWorkerSrc);
      console.log(`Fallback PDF worker available: ${results.fallback}`);
    }
    
    return results;
  } catch (error) {
    console.error('Error verifying workers:', error);
    return results;
  }
};
