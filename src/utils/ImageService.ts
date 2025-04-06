
import { logError, logInfo } from './logger';

export class ImageService {
  // Get base URL for images based on environment
  static getBaseImageUrl(): string {
    // For Vercel, use the VERCEL_URL environment variable
    if (typeof process !== 'undefined' && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    
    // Local development
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    return '';
  }
  
  // Get full image URL
  static getImageUrl(path: string): string {
    // Check if already absolute URL
    if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
      return path;
    }
    
    // For data URLs
    if (path && path.startsWith('data:')) {
      return path;
    }
    
    // Add base URL to relative paths
    const baseUrl = this.getBaseImageUrl();
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
  
  // Store an image (blob or file)
  static async storeImage(imageData: File | Blob): Promise<string> {
    try {
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      // Return a promise that resolves with the data URL
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            // Store in localStorage for now (fallback approach)
            const imageKey = `img_${Date.now()}`;
            try {
              localStorage.setItem(imageKey, reader.result);
              logInfo('Image stored in localStorage', { key: imageKey });
              resolve(reader.result);
            } catch (storageError) {
              // If localStorage fails (e.g., quota exceeded), just return the data URL
              logError('Failed to store image in localStorage', { error: storageError });
              resolve(reader.result);
            }
          } else {
            reject(new Error('FileReader did not return a string'));
          }
        };
        
        reader.onerror = () => {
          reject(reader.error || new Error('Error reading file'));
        };
        
        // Read the image as a data URL
        reader.readAsDataURL(imageData);
      });
    } catch (error) {
      logError('Image storage error', { error });
      throw error;
    }
  }
  
  // Load an image from storage
  static async loadImage(key: string): Promise<string | null> {
    // First check if it's a data URL or full URL
    if (key.startsWith('data:') || key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
    
    // Try to get from localStorage
    try {
      const storedImage = localStorage.getItem(key);
      if (storedImage) {
        return storedImage;
      }
    } catch (error) {
      logError('Error loading image from localStorage', { error, key });
    }
    
    // If not found, return null
    return null;
  }
}
