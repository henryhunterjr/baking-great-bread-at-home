
import { createWorker } from 'tesseract.js';
import { extractTextFromPDF, cleanPDFText } from '@/lib/ai-services';
import { logError, logInfo } from '@/utils/logger';

// Handle image file with OCR
export const processImageFile = async (
  file: File, 
  onProgress: (progress: number) => void, 
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    logInfo("Processing image file:", { filename: file.name });
    
    // Create worker with compatible configuration for Tesseract.js v4+
    const worker = await createWorker('eng');
    
    // Set initial progress
    onProgress(10);
    
    let lastProgress = 10;
    // Use a manual progress update approach since setProgressHandler isn't available in v4+
    const progressInterval = setInterval(() => {
      if (lastProgress < 95) {
        lastProgress += 5;
        onProgress(lastProgress);
      }
    }, 1000);
    
    logInfo("Starting OCR on image");
    
    // Recognize text from the image
    const result = await worker.recognize(file);
    
    // Clear the progress interval
    clearInterval(progressInterval);
    
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
    logError('OCR processing error:', { error: err });
    onError("Failed to process the image. Please try again with a different image.");
  }
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
  
  try {
    logInfo("Processing PDF file:", { filename: file.name, filesize: file.size });
    
    // Set up a timeout to handle stalls
    timeoutId = window.setTimeout(() => {
      logInfo("PDF processing timeout triggered");
      isCancelled = true;
      onError("Processing is taking longer than expected. Please try again or use a different file format.");
    }, 120000); // 2 minute timeout
    
    // Extract text from the PDF with progress reporting
    const extractedText = await extractTextFromPDF(file, (progress) => {
      if (isCancelled) return;
      logInfo("PDF processing progress:", { progress });
      onProgress(progress);
    });
    
    // Clear the timeout since we succeeded
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return;
    
    logInfo("PDF extraction complete, text length:", { length: extractedText.length });
    
    if (!extractedText || extractedText.trim().length === 0) {
      onError("No text found in the PDF. Please try with a different file.");
      return;
    }
    
    // Clean the extracted text
    const cleanedText = cleanPDFText(extractedText);
    
    // Pass the cleaned text to the callback
    onComplete(cleanedText);
  } catch (err) {
    logError('PDF processing error:', { error: err });
    
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    
    if (!isCancelled) {
      onError("Failed to process the PDF. Please try again with a different file.");
    }
  }
};
