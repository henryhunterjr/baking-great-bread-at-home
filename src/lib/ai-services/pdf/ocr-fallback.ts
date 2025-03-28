
import { logInfo, logError } from '@/utils/logger';
import { extractTextWithOCR } from './ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { ProgressCallback } from './types';

/**
 * Attempt OCR extraction as a fallback when normal text extraction fails
 * @param file The PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The text extracted via OCR
 */
export const attemptOCRFallback = async (
  file: File,
  progressCallback?: ProgressCallback
): Promise<string> => {
  try {
    logInfo("PDF processing: Normal extraction failed, trying OCR fallback", {
      fileName: file.name,
      fileSize: file.size
    });
    
    // Update progress if callback provided
    if (progressCallback) progressCallback(75);
    
    // Convert first page of PDF to image with longer timeout (increased from 8000ms)
    const imageDataUrl = await convertPDFPageToImage(file, 20000);
    
    if (progressCallback) progressCallback(85);
    
    // Convert the data URL to a File object
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const imageFile = new File([blob], "pdf-page.jpg", { type: "image/jpeg" });
    
    // Perform OCR on the image with better progress tracking
    const extractedText = await extractTextWithOCR(imageFile, (ocrProgress) => {
      // Map OCR progress from 85% to 100% with more granular updates
      if (progressCallback) {
        const mappedProgress = Math.floor(85 + (ocrProgress * 15));
        progressCallback(mappedProgress);
      }
    });
    
    // Validate extracted text content
    if (!extractedText || extractedText.trim().length < 20) {
      logInfo("PDF processing: OCR extraction yielded insufficient text", { 
        textLength: extractedText?.length || 0 
      });
      throw new Error("OCR extraction yielded insufficient text. The PDF might contain complex formatting or low-quality text.");
    }
    
    logInfo("PDF processing: OCR fallback complete", { textLength: extractedText.length });
    return extractedText;
  } catch (ocrError) {
    logError('OCR fallback failed:', { error: ocrError });
    
    // Provide a more helpful and specific error message
    let errorMessage = 'Failed to extract text via OCR';
    if (ocrError instanceof Error) {
      errorMessage += ': ' + ocrError.message;
      
      if (ocrError.message.includes('timed out')) {
        errorMessage += '. The PDF might be too complex or large to process in the browser. Try uploading just a single page or using text input instead.';
      } else if (ocrError.message.includes('image') || ocrError.message.includes('canvas')) {
        errorMessage += '. There was a problem converting the PDF to an image. Try using a screenshot of the recipe instead.';
      } else if (ocrError.message.includes('insufficient text')) {
        errorMessage += '. Try using a PDF with clearer text or manually type the recipe.';
      }
    }
    
    throw new Error(errorMessage);
  }
};
