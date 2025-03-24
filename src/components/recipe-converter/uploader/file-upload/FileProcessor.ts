
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
    // Create worker and monitor progress with the logger callback
    const worker = await createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          onProgress(Math.floor((m.progress || 0) * 100));
        }
      },
    } as any);
    
    // Recognize text from the image
    const { data } = await worker.recognize(file);
    
    // Clean up the worker
    await worker.terminate();
    
    // Pass the extracted text to the parent
    if (data.text.trim().length > 0) {
      onComplete(data.text);
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
  try {
    // Extract text from the PDF
    const extractedText = await extractTextFromPDF(file, onProgress);
    
    if (extractedText.trim().length === 0) {
      onError("No text found in the PDF. Please try with a different file.");
      return;
    }
    
    // Clean the extracted text
    const cleanedText = cleanPDFText(extractedText);
    
    // Pass the cleaned text to the callback
    onComplete(cleanedText);
  } catch (err) {
    console.error('PDF processing error:', err);
    onError("Failed to process the PDF. Please try again with a different file.");
  }
};
