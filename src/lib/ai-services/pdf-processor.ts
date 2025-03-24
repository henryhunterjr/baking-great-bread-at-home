
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
    
    console.log("PDF processing: Starting to load document...");
    
    // Load the PDF document with explicit worker source and better options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: true,
      disableFontFace: true,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/cmaps/',
      cMapPacked: true,
    });
    
    // Add event listeners for better debugging
    loadingTask.onProgress = (data) => {
      const progress = data.loaded / (data.total || 1) * 100;
      console.log(`PDF loading progress: ${Math.round(progress)}%`);
      if (progressCallback) progressCallback(10 + Math.round(progress * 0.2)); // Map to 10-30% range
    };
    
    console.log("PDF processing: Waiting for document to load...");
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    console.log(`PDF processing: Document loaded with ${numPages} pages`);
    if (progressCallback) progressCallback(30);
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      // Update progress (distribute from 30% to 90% based on page count)
      if (progressCallback) {
        const pageProgress = 30 + Math.floor((i / numPages) * 60);
        progressCallback(pageProgress);
      }
      
      console.log(`PDF processing: Getting page ${i}/${numPages}...`);
      try {
        const page = await pdf.getPage(i);
        console.log(`PDF processing: Got page ${i}, extracting text content...`);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        console.log(`PDF processing: Extracted ${pageText.length} characters from page ${i}`);
        fullText += pageText + '\n\n';
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        // Continue with next page instead of failing completely
      }
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      console.log("PDF processing: Not enough text extracted, falling back to OCR");
      // Fall back to OCR
      fullText = await extractTextWithOCR(file, progressCallback);
    }
    
    if (progressCallback) progressCallback(100);
    
    return fullText || "No text could be extracted from this PDF.";
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    
    // Try OCR as fallback for any error
    try {
      console.log("PDF processing: Primary extraction failed, trying OCR fallback");
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
    
    console.log("OCR processing: Initializing worker...");
    
    // Use the correct API format for Tesseract.js v4+
    const worker = await createWorker('eng');
    
    console.log("OCR processing: Worker initialized");
    
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
      console.log("OCR processing: Converting PDF to image...");
      // Try to convert first page to image using a canvas (if browser supports it)
      imageURL = await convertPDFPageToImage(file);
      console.log("OCR processing: Successfully converted PDF to image");
    } catch (err) {
      console.error('Failed to convert PDF to image:', err);
      // Just use the file directly as fallback
    }
    
    console.log("OCR processing: Starting text recognition...");
    // Recognize text from the source (imageURL or file)
    const result = await worker.recognize(imageURL || file);
    
    console.log("OCR processing: Text recognition complete");
    
    // Clear the interval
    clearInterval(progressInterval);
    
    // Clean up the worker
    await worker.terminate();
    
    if (progressCallback) progressCallback(100);
    
    return result.data.text || 'No text detected in the PDF.';
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
