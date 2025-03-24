
import { createWorker } from 'tesseract.js';
import { extractTextFromPDF } from '@/lib/ai-services';
import { logError, logInfo } from '@/utils/logger';

// Handle image file with OCR
export const processImageFile = async (
  file: File, 
  onProgress: (progress: number) => void, 
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  let abortController = new AbortController();
  let isAborted = false;
  
  try {
    logInfo("Processing image file:", { filename: file.name });
    
    // Create worker with language - this is the v6 style
    const worker = await createWorker('eng');
    
    // Set initial progress
    onProgress(10);
    
    // Check if the process has been aborted
    if (isAborted) {
      await worker.terminate();
      return;
    }
    
    let lastProgress = 10;
    // Use a manual progress update approach since built-in progress reporting is limited in v6
    const progressInterval = setInterval(() => {
      if (lastProgress < 95 && !isAborted) {
        lastProgress += 5;
        onProgress(lastProgress);
      }
    }, 1000);
    
    logInfo("Starting OCR on image");
    
    // Add abort handler
    abortController.signal.addEventListener('abort', async () => {
      isAborted = true;
      clearInterval(progressInterval);
      await worker.terminate();
      logInfo("Image OCR process was cancelled");
    });
    
    // Recognize text from the image using v6 API
    const result = await worker.recognize(file);
    
    // Clear the progress interval
    clearInterval(progressInterval);
    
    // Check if the operation was cancelled
    if (isAborted) return;
    
    logInfo("OCR complete, extracted text length:", { length: result.data.text.length });
    
    // Make sure we report 100% when done
    onProgress(100);
    
    // Clean up the worker
    await worker.terminate();
    
    // Pass the extracted text to the parent
    if (result.data.text.trim().length > 0) {
      onComplete(result.data.text);
    } else {
      onError("No text found in the image. Please try with a clearer image.");
    }
  } catch (err) {
    if (!isAborted) {
      logError('OCR processing error:', { error: err });
      onError("Failed to process the image. Please try again with a different image.");
    }
  }
  
  return {
    cancel: () => {
      abortController.abort();
    }
  };
};

// Handle PDF file
export const processPDFFile = async (
  file: File, 
  onProgress: (progress: number) => void, 
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  // Create a cancel token
  let isCancelled = false;
  let timeoutId: number | null = null;
  let longRunningWarningId: number | null = null;
  let abortController = new AbortController();
  
  try {
    logInfo("Processing PDF file:", { filename: file.name, filesize: file.size });
    
    // Adjust timeout based on file size (larger files need more time)
    const fileSize = file.size;
    const timeoutDuration = Math.max(30000, Math.min(300000, fileSize / 1024 * 10));
    
    // Set up a timeout to handle stalls
    timeoutId = window.setTimeout(() => {
      logInfo("PDF processing timeout triggered");
      isCancelled = true;
      abortController.abort();
      onError("Processing timed out. Please try again or use a different file format.");
    }, timeoutDuration); // Dynamic timeout based on file size
    
    // Set up a warning for long-running processes
    longRunningWarningId = window.setTimeout(() => {
      logInfo("PDF processing long-running warning triggered");
      // Don't abort, just warn the user that it's taking longer than expected
    }, 30000); // 30 second warning
    
    // Use signal from AbortController to allow cancellation
    abortController.signal.addEventListener('abort', () => {
      isCancelled = true;
      logInfo("PDF processing was cancelled by user");
    });
    
    // Extract text from the PDF with progress reporting
    const extractedText = await extractTextFromPDF(file, (progress) => {
      if (isCancelled) return;
      logInfo("PDF processing progress:", { progress });
      onProgress(progress);
    });
    
    // Clear the timeouts since we succeeded
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (longRunningWarningId) {
      window.clearTimeout(longRunningWarningId);
      longRunningWarningId = null;
    }
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return;
    
    logInfo("PDF extraction complete, text length:", { length: extractedText.length });
    
    if (!extractedText || extractedText.trim().length === 0) {
      onError("No text found in the PDF. Please try with a different file.");
      return;
    }
    
    // Clean the extracted text
    const cleanedText = extractedText.replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    // Pass the cleaned text to the callback
    onComplete(cleanedText);
  } catch (err) {
    logError('PDF processing error:', { error: err });
    
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    
    if (longRunningWarningId) {
      window.clearTimeout(longRunningWarningId);
    }
    
    if (!isCancelled) {
      onError("Failed to process the PDF. Please try again with a different file.");
    }
  }
  
  return {
    cancel: () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (longRunningWarningId) {
        window.clearTimeout(longRunningWarningId);
        longRunningWarningId = null;
      }
      
      abortController.abort();
      isCancelled = true;
      logInfo("PDF processing cancelled by user");
    }
  };
};
