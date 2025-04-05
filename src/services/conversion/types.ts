
export enum ConversionErrorType {
  PDF_EXTRACTION = 'pdf_extraction',
  IMAGE_PROCESSING = 'image_processing',
  FORMAT_DETECTION = 'format_detection',
  UNIT_CONVERSION = 'unit_conversion',
  PARSING_ERROR = 'parsing_error',
  UNKNOWN = 'unknown'
}

export interface ConversionResult {
  success: boolean;
  data?: any;
  error?: {
    type: ConversionErrorType;
    message: string;
    details?: any;
  };
  aiSuggestions?: {
    tips: string[];
    improvements: string[];
    alternativeMethods?: string[];
  };
}

export interface AISuggestions {
  tips: string[];
  improvements: string[];
  alternativeMethods?: string[];
}
