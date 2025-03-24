
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set local worker path explicitly
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

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
    
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    // Load the PDF document with explicit worker source
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: true,
      disableFontFace: true
    });
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    if (progressCallback) progressCallback(30);
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      // Update progress (distribute from 30% to 90% based on page count)
      if (progressCallback) {
        const pageProgress = 30 + Math.floor((i / numPages) * 60);
        progressCallback(pageProgress);
      }
      
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        // Continue with next page instead of failing completely
      }
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      // Fall back to OCR
      console.log("Not enough text extracted from PDF, falling back to OCR");
      fullText = await extractTextWithOCR(file, progressCallback);
    }
    
    if (progressCallback) progressCallback(100);
    
    return fullText || "No text could be extracted from this PDF.";
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
    if (progressCallback) progressCallback(40);
    
    // Create a worker for OCR processing with fixed logger
    const worker = await createWorker({
      logger: (m) => {
        // Safe logging that won't cause circular reference issues
        console.log(m.status);
      }
    });
    
    let lastProgress = 40;
    const updateProgress = () => {
      if (progressCallback && lastProgress < 90) {
        lastProgress += 5;
        progressCallback(lastProgress);
      }
    };
    
    // Set up regular progress updates
    const progressInterval = setInterval(updateProgress, 1000);
    
    // Convert the PDF to an image and recognize text
    // We're using a Data URL for more reliable handling
    let imageURL;
    try {
      // Try to convert first page to image using a canvas (if browser supports it)
      imageURL = await convertPDFPageToImage(file);
    } catch (err) {
      console.error('Failed to convert PDF to image:', err);
      // Just use the file directly as fallback
    }
    
    // Recognize text from the source (imageURL or file)
    const { data } = await worker.recognize(imageURL || file);
    
    // Clear the interval
    clearInterval(progressInterval);
    
    // Clean up the worker
    await worker.terminate();
    
    if (progressCallback) progressCallback(100);
    
    return data.text || 'No text detected in the PDF.';
  } catch (error) {
    console.error('Error performing OCR on PDF:', error);
    throw new Error('Failed to perform OCR on PDF');
  }
};

/**
 * Convert the first page of a PDF to an image using canvas
 */
const convertPDFPageToImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false
    });
    
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    // Create a canvas to render the PDF page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context could not be created');
    }
    
    // Set the dimensions
    const viewport = page.getViewport({ scale: 1.5 }); // Scale up for better OCR results
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render the PDF page to the canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to image data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
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
