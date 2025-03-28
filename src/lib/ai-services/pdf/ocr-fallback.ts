import { logInfo, logError } from '@/utils/logger';
import { extractTextWithOCR } from './ocr/ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { ProgressCallback } from './types';
import { createThrottledProgressReporter } from './ocr/ocr-utils';

/**
 * Converts a data URL to a File object for OCR processing
 */
function dataURLtoFile(dataUrl: string, filename: string): File {
  try {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    logError('Failed to convert data URL to File', { error });
    throw new Error('Failed to prepare image for OCR: ' + (error instanceof Error ? error.message : String(error)));
  }
}

export const attemptOCRFallback = async (
  file: File,
  progressCallback?: ProgressCallback,
  signal?: AbortSignal
): Promise<string> => {
  try {
    logInfo("PDF processing: Normal extraction failed, trying OCR fallback", {
      fileName: file.name,
      fileSize: file.size
    });
    
    // Check for cancellation
    if (signal?.aborted) {
      throw new Error('OCR fallback operation cancelled');
    }
    
    // Create a throttled progress reporter to avoid too many updates
    const throttledProgress = progressCallback 
      ? createThrottledProgressReporter(progressCallback, 300)
      : undefined;
    
    // Update progress if callback provided
    if (throttledProgress) throttledProgress(75);
    
    // Check for cancellation before expensive operation
    if (signal?.aborted) {
      throw new Error('OCR fallback operation cancelled');
    }
    
    // Convert first page of PDF to image with longer timeout
    const imageDataUrl = await convertPDFPageToImage(file, 20000);
    
    if (throttledProgress) throttledProgress(85);
    
    // Check for cancellation after conversion
    if (signal?.aborted) {
      throw new Error('OCR fallback operation cancelled after PDF to image conversion');
    }
    
    // Convert the data URL to a File object safely
    const imageFile = dataURLtoFile(imageDataUrl, "pdf-page.jpg");
    
    // Perform OCR on the image with better progress tracking
    const extractedText = await extractTextWithOCR(imageFile, (ocrProgress) => {
      // Map OCR progress from 85% to 100% with more granular updates
      if (throttledProgress) {
        const mappedProgress = Math.floor(85 + (ocrProgress * 15));
        throttledProgress(mappedProgress);
      }
    }, { signal });
    
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
    // Handle cancellation specifically
    if (signal?.aborted) {
      logInfo('OCR fallback cancelled by user');
      throw new Error('OCR operation was cancelled');
    }
    
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
      } else if (ocrError.message.includes('memory')) {
        errorMessage += '. Your browser ran out of memory while processing this PDF. Try a smaller file or a screenshot of just the recipe part.';
      }
    }
    
    throw new Error(errorMessage);
  }
};
