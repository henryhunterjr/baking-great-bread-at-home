
import { Recipe } from '@/types/recipe';
import { processRecipeTextWithAI } from './openai-service';
import Tesseract from 'tesseract.js';

/**
 * Process and structure recipe text using AI
 * @param {string} recipeText - The raw recipe text to process
 * @returns {Promise<Recipe>} - Structured recipe object
 */
export const processRecipeText = async (recipeText: string): Promise<Recipe> => {
  try {
    return await processRecipeTextWithAI(recipeText);
  } catch (error) {
    console.error('Error processing recipe:', error);
    throw error;
  }
};

/**
 * Extract text from an image using Tesseract OCR
 * @param {File} imageFile - The image file to process
 * @returns {Promise<string>} - Extracted text from the image
 */
export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    const worker = await Tesseract.createWorker('eng');
    
    // Convert file to image data
    const imageData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
    
    const result = await worker.recognize(imageData);
    await worker.terminate();
    
    return result.data.text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image. Please try a clearer image or enter the text manually.');
  }
};
