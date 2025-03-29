import { useState } from 'react';
import { extractTextFromPDF } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

interface PDFProcessingResult {
  text: string | null;
  error: string | null;
}

interface PDFProcessingState {
  processing: boolean;
  progress: number;
  result: PDFProcessingResult;
}

interface PDFProcessingCallbacks {
  onProgress?: (progress: number) => void;
  onComplete?: (result: PDFProcessingResult) => void;
  onError?: (error: string) => void;
}

export const usePDFProcessing = (
  file: File | null,
  callbacks: PDFProcessingCallbacks = {}
) => {
  const [processingState, setProcessingState] = useState<PDFProcessingState>({
    processing: false,
    progress: 0,
    result: { text: null, error: null },
  });

  const { onProgress, onComplete, onError } = callbacks;

  const processPDF = async () => {
    if (!file) {
      console.warn("No file to process.");
      return;
    }

    setProcessingState(prevState => ({ ...prevState, processing: true, progress: 0, result: { text: null, error: null } }));

    let timeoutId: NodeJS.Timeout | null = null;
    let cancelled = false;

    const progressCallback = (progress: number) => {
      if (cancelled) return;
      setProcessingState(prevState => ({ ...prevState, progress: Math.round(progress * 100) }));
      onProgress?.(Math.round(progress * 100));
    };

    const setError = (error: string) => {
      logError("PDF processing error:", { error });
      setProcessingState(prevState => ({
        ...prevState,
        processing: false,
        progress: 0,
        result: { text: null, error: error },
      }));
      onError?.(error);
    };

    try {
      logInfo("Starting PDF processing", { filename: file.name, filesize: file.size });

      // Set a timeout to prevent indefinite processing
      timeoutId = setTimeout(() => {
        cancelled = true;
        setError("PDF processing timed out.");
        setProcessingState(prevState => ({ ...prevState, processing: false, progress: 0 }));
      }, 120000); // 2 minutes

      const extractResult = await extractTextFromPDF(file, progressCallback);

      // Clear the timeout since we're done
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Check if processing was cancelled
      if (cancelled) return;

      // Handle different types of results
      if (extractResult === null || extractResult === undefined) {
        setError("Failed to extract text from the PDF. The file may be empty or corrupted.");
        setProcessingState(prevState => ({ ...prevState, progress: 0, processing: false }));
        return;
      }

      // Check if the result is a cancellable task
      if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
        // Store the cancellable task reference for later use
        // and possibly return or handle differently based on your app's needs
        return;
      }

      // At this point, we know extractResult is a string
      const extractedText = extractResult as string;

      if (!extractedText || extractedText.trim().length === 0) {
        setError("No text was found in this PDF. It may contain only images or be scanned.");
        setProcessingState(prevState => ({ ...prevState, processing: false, progress: 0 }));
        return;
      }

      const cleanedText = cleanOCRText(extractedText);

      setProcessingState(prevState => ({
        ...prevState,
        processing: false,
        progress: 100,
        result: { text: cleanedText, error: null },
      }));
      logInfo("PDF extraction complete", { textLength: cleanedText.length });
      onComplete?.({ text: cleanedText, error: null });

    } catch (error: any) {
      setError(error.message || "An unexpected error occurred during PDF processing.");
      setProcessingState(prevState => ({ ...prevState, processing: false, progress: 0 }));
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setProcessingState(prevState => ({ ...prevState, processing: false }));
    }
  };

  return {
    ...processingState,
    processPDF,
  };
};
