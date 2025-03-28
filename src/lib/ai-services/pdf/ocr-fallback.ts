
import { logInfo, logError } from '@/utils/logger';
import { extractTextWithOCR } from './ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { ProgressCallback } from './types';

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
    
    // Convert first page of PDF to image with longer timeout
    const imageDataUrl = await convertPDFPageToImage(file, 20000);
    
    if (progressCallback) progressCallback(85);
    
    // Convert the data URL to a File object safely
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
      throw new Error("OCR extraction yielded insufficient text.");
    }
    
    logInfo("PDF processing: OCR fallback complete", { textLength: extractedText.length });
    return extractedText;
  } catch (ocrError) {
    logError('OCR fallback failed:', { error: ocrError });
    throw ocrError;
  }
};
