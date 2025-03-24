
import { createWorker } from 'tesseract.js';
import { extractTextFromPDF, cleanPDFText } from '@/lib/ai-services/pdf-processor';

// Handle image file with OCR
export const processImageFile = async (
  file: File, 
  onProgress: (progress: number) => void, 
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    console.log("Processing image file:", file.name);
    
    // Create worker with compatible configuration for Tesseract.js v4+
    const worker = await createWorker('eng');
    
    // Set initial progress
    onProgress(10);
    
    // Set up progress reporting
    worker.setProgressHandler((progress) => {
      if (progress && typeof progress === 'number') {
        const mappedProgress = Math.floor(progress * 90) + 10; // Map from 0-1 to 10-100
        onProgress(mappedProgress < 100 ? mappedProgress : 99); // Keep at 99% until complete
      }
    });
    
    console.log("Starting OCR on image");
    
    // Recognize text from the image
    const result = await worker.recognize(file);
    
    console.log("OCR complete, extracted text length:", result.data.text.length);
    
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
    console.error('OCR processing error:', err);
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
    console.log("Processing PDF file:", file.name, "size:", file.size);
    
    // Set up a timeout to handle stalls
    timeoutId = window.setTimeout(() => {
      console.log("PDF processing timeout triggered");
      isCancelled = true;
      onError("Processing is taking longer than expected. Please try again or use a different file format.");
    }, 120000); // 2 minute timeout
    
    // Extract text from the PDF with progress reporting
    const extractedText = await extractTextFromPDF(file, (progress) => {
      if (isCancelled) return;
      console.log("PDF processing progress:", progress);
      onProgress(progress);
    });
    
    // Clear the timeout since we succeeded
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return;
    
    console.log("PDF extraction complete, text length:", extractedText.length);
    
    if (!extractedText || extractedText.trim().length === 0) {
      onError("No text found in the PDF. Please try with a different file.");
      return;
    }
    
    // Clean the extracted text
    const cleanedText = cleanPDFText(extractedText);
    
    // Pass the cleaned text to the callback
    onComplete(cleanedText);
  } catch (err) {
    console.error('PDF processing error:', err);
    
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    
    if (!isCancelled) {
      onError("Failed to process the PDF. Please try again with a different file.");
    }
  }
};
