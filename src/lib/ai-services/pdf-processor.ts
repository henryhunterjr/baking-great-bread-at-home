
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text from a PDF file
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text from the PDF
 */
export const extractTextFromPDF = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    let fullText = '';
    let extractedText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      // Update progress (distribute from 10% to 90% based on page count)
      if (progressCallback) {
        const pageProgress = 10 + Math.floor((i / numPages) * 80);
        progressCallback(pageProgress);
      }
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract text items and join them
      extractedText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += extractedText + '\n\n';
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      // Fall back to OCR
      fullText = await extractTextWithOCR(file, progressCallback);
    }
    
    if (progressCallback) progressCallback(100);
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    
    // Try OCR as fallback for any error
    try {
      return await extractTextWithOCR(file, progressCallback);
    } catch (ocrError) {
      console.error('OCR fallback also failed:', ocrError);
      throw new Error('Failed to extract text from PDF');
    }
  }
};

/**
 * Use OCR to extract text from a PDF that's likely scanned
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The OCR-extracted text
 */
export const extractTextWithOCR = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  try {
    if (progressCallback) progressCallback(30);
    
    // Create a worker for OCR processing
    const worker = await createWorker({
      logger: m => {
        if (m.status === 'recognizing text' && progressCallback) {
          // Map the OCR progress (0-1) to our progress scale (30-90)
          const scaledProgress = 30 + Math.floor((m.progress || 0) * 60);
          progressCallback(scaledProgress);
        }
      },
    } as any);
    
    // Recognize text from the PDF file
    const { data } = await worker.recognize(file);
    
    // Clean up the worker
    await worker.terminate();
    
    if (progressCallback) progressCallback(100);
    
    return data.text;
  } catch (error) {
    console.error('Error performing OCR on PDF:', error);
    throw new Error('Failed to perform OCR on PDF');
  }
};

/**
 * Clean and normalize the text extracted from a PDF
 */
export const cleanPDFText = (text: string): string => {
  // Remove excessive whitespace and normalize line breaks
  let cleaned = text.replace(/\r\n/g, '\n');
  
  // Fix hyphenated words that span multiple lines
  cleaned = cleaned.replace(/(\w+)-\n(\w+)/g, '$1$2');
  
  // Remove multiple consecutive spaces
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  
  // Remove multiple empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Fix common OCR errors
  cleaned = cleaned.replace(/l\/2/g, '1/2'); // Replace l/2 with 1/2
  cleaned = cleaned.replace(/l\/4/g, '1/4'); // Replace l/4 with 1/4
  cleaned = cleaned.replace(/l\/3/g, '1/3'); // Replace l/3 with 1/3
  
  return cleaned.trim();
};
