
import { createWorker } from 'tesseract.js';
import { extractTextFromPDF } from '@/lib/ai-services';
import { logError, logInfo } from '@/utils/logger';
import { extractTextWithOCR } from '@/lib/ai-services/pdf';

// Handle image file with OCR
export const processImageFile = async (
  file: File, 
  onProgress: (progress: number) => void, 
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  let isAborted = false;
  
  try {
    logInfo("Processing image file:", { filename: file.name });
    
    // Set initial progress
    onProgress(10);
    
    try {
      // Add timeout protection to ensure process doesn't hang
      const extractionPromise = Promise.race([
        extractTextWithOCR(file, (progress) => {
          if (!isAborted) {
            onProgress(progress);
          }
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('OCR processing timed out')), 60000)
        )
      ]);
      
      const extractedText = await extractionPromise;
      
      // Check if the operation was cancelled
      if (isAborted) return;
      
      logInfo("OCR complete, extracted text length:", { length: extractedText.length });
      
      // Make sure we report 100% when done
      onProgress(100);
      
      // Pass the extracted text to the parent
      if (extractedText.trim().length > 0) {
        onComplete(extractedText);
      } else {
        onError("No text found in the image. Please try with a clearer image or a different format.");
      }
    } catch (recognizeError) {
      if (!isAborted) {
        logError('OCR processing error:', { error: recognizeError });
        onError(`Failed to process the image: ${recognizeError instanceof Error ? recognizeError.message : 'Unknown error'}. Please try with a clearer image.`);
      }
    }
  } catch (err) {
    if (!isAborted) {
      logError('OCR processing error:', { error: err });
      onError("Failed to process the image. Please try again with a different image.");
    }
  }
  
  return {
    cancel: () => {
      isAborted = true;
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
  
  try {
    logInfo("Processing PDF file:", { filename: file.name, filesize: file.size });
    
    // Add timeout protection for the entire process
    const extractionPromise = Promise.race([
      // Extract text from the PDF with progress reporting
      extractTextFromPDF(file, (progress) => {
        if (isCancelled) return;
        logInfo("PDF processing progress:", { progress });
        onProgress(progress);
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('PDF processing timed out after 2 minutes')), 120000)
      )
    ]);
    
    const extractedText = await extractionPromise;
    
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
    
    if (!isCancelled) {
      onError(`Failed to process the PDF: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again with a different file.`);
    }
  }
  
  return {
    cancel: () => {
      isCancelled = true;
      logInfo("PDF processing cancelled by user");
    }
  };
};
