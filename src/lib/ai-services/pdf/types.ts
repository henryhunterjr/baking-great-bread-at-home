
import * as pdfjsLib from 'pdfjs-dist';

export interface CancellableTask {
  cancel: () => void;
}

export type ProgressCallback = (progress: number) => void;

export type ExtractTextResult = string | CancellableTask;

export interface OCROptions {
  language?: string;
  enhanceImage?: boolean;
}
