
import { logInfo, logError } from '@/utils/logger';
import { getOpenAIApiKey } from './key-management';
import { AI_CONFIG } from './config';

/**
 * Clean and normalize OCR text
 * @param text The raw OCR text to clean
 * @returns The cleaned text
 */
export const cleanOCRText = (text: string): string => {
  if (!text) return '';
  
  // Basic cleaning operations
  return text
    .replace(/(\r\n|\n){3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\s{2,}/g, ' ')           // Replace multiple spaces with single space
    .trim();                           // Trim whitespace from ends
};

/**
 * Process OCR text using AI to improve structure and readability
 * @param text The OCR text to process
 * @returns The processed text
 */
export const processOCRWithAI = async (text: string): Promise<string> => {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return cleanOCRText(text);
  }
  
  try {
    logInfo('Processing OCR text with AI', { textLength: text.length });
    
    // Basic cleaning first
    const cleanedText = cleanOCRText(text);
    
    // If text is very short, just return the cleaned version
    if (cleanedText.length < 50) {
      return cleanedText;
    }
    
    try {
      // Try to use AI to improve OCR text
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that cleans and formats recipe text from OCR. Fix typos, formatting issues, and organize the content into a clear recipe format with ingredients and instructions. Preserve all recipe details.'
            },
            {
              role: 'user',
              content: `Clean and format this recipe text from OCR: ${cleanedText}`
            }
          ],
          temperature: 0.3,
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const improvedText = data.choices?.[0]?.message?.content;
      
      if (!improvedText) {
        return cleanedText;
      }
      
      return improvedText;
    } catch (error) {
      logError('Error processing OCR with AI:', { error });
      return cleanedText;
    }
  } catch (error) {
    logError('Error in OCR processing:', { error });
    return text;
  }
};
