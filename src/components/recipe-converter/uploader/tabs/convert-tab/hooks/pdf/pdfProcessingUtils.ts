
// This file is being refactored. Export from the new location for backward compatibility.
import { processPDFWithTimeout, processPDF } from '@/lib/pdf-processing/pdf-extractor';
import { processPDFText } from '@/lib/pdf-processing/core/text-processor';

// Re-export all functions for backward compatibility
export { processPDFWithTimeout, processPDFText };

// Re-export for components that directly use this function
export { processPDF } from '@/lib/pdf-processing/pdf-extractor';
