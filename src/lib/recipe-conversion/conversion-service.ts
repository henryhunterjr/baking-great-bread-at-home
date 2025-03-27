import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey, isOpenAIConfigured, updateOpenAIApiKey } from '@/lib/ai-services/ai-config';

export const convertRecipeText = async (
  text: string, 
  onSuccess: (recipe: RecipeData) => void, 
  onError: (error: Error) => void
): Promise<void> => {
  if (!text || text.trim() === '') {
    onError(new Error('Empty or invalid recipe text provided'));
    return;
  }

  try {
    logInfo('Starting recipe conversion', { 
      textLength: text.length,
      textPreview: text.substring(0, 100)
    });
    
    // Make sure we have the latest OpenAI API key
    updateOpenAIApiKey();
    
    // Check API key status
    const apiKey = getOpenAIApiKey();
    logInfo('API Key Status during recipe conversion', { 
      keyPresent: !!apiKey,
      keyFormat: !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 20
    });
    
    // Check if OpenAI API is configured before proceeding
    if (!isOpenAIConfigured()) {
      const errorMsg = 'AI service not configured with valid API key. Please add your API key in settings.';
      logError('Recipe conversion failed', { error: errorMsg });
      throw new Error(errorMsg);
    }
    
    // Clean the text first
    const cleanedText = cleanOCRText(text);
    
    if (!cleanedText || cleanedText.trim() === '') {
      logError('Text cleaning resulted in empty content', {
        originalTextLength: text.length
      });
      throw new Error('Text cleaning resulted in empty content');
    }
    
    logInfo('Text cleaned successfully', {
      originalLength: text.length,
      cleanedLength: cleanedText.length
    });
    
    try {
      // Process the recipe text
      const response = await processRecipeText(cleanedText);
      
      // Check if the response is successful and has a recipe
      if (response.success && response.recipe) {
        // Convert the recipe to RecipeData format with default values for safety
        const convertedRecipe: RecipeData = {
          title: response.recipe.title || 'Untitled Recipe',
          introduction: response.recipe.introduction || '',
          ingredients: response.recipe.ingredients || [],
          prepTime: response.recipe.prepTime || '',
          restTime: response.recipe.restTime || '',
          bakeTime: response.recipe.bakeTime || '',
          totalTime: response.recipe.totalTime || '',
          instructions: response.recipe.instructions || [],
          tips: response.recipe.tips || [],
          proTips: response.recipe.proTips || [],
          equipmentNeeded: Array.isArray(response.recipe.equipmentNeeded) ? 
            response.recipe.equipmentNeeded : [],
          imageUrl: response.recipe.imageUrl || 
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
          tags: Array.isArray(response.recipe.tags) ? response.recipe.tags : [],
          isPublic: false,
          isConverted: true
        };
        
        logInfo('Recipe conversion successful', { 
          recipeTitle: convertedRecipe.title,
          ingredientsCount: convertedRecipe.ingredients.length,
          instructionsCount: convertedRecipe.instructions.length
        });
        
        onSuccess(convertedRecipe);
      } else {
        // Try enhanced fallback if AI processing failed
        logInfo('AI processing failed, trying enhanced fallback parser');
        const fallbackRecipe = createEnhancedFallbackRecipe(cleanedText);
        
        if (fallbackRecipe.ingredients.length > 1 && fallbackRecipe.instructions.length > 1) {
          logInfo('Enhanced fallback parsing successful', {
            title: fallbackRecipe.title,
            ingredientsCount: fallbackRecipe.ingredients.length,
            instructionsCount: fallbackRecipe.instructions.length
          });
          onSuccess(fallbackRecipe);
        } else {
          const errorMessage = response.error || 'Failed to convert recipe: No valid recipe data returned';
          logError('Recipe conversion failed and fallback parsing insufficient', { error: errorMessage });
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      // For API errors, use a fallback method with local parsing
      logInfo('Using fallback recipe conversion method');
      
      // Create a basic parsed recipe with what we have
      const fallbackRecipe: RecipeData = createFallbackRecipe(cleanedText);
      
      // Let the user know we're using a basic conversion
      logInfo('Using fallback recipe conversion', {
        fallbackTitle: fallbackRecipe.title,
        fallbackIngredients: fallbackRecipe.ingredients.length
      });
      
      onSuccess(fallbackRecipe);
    }
  } catch (error) {
    logError('Recipe conversion error', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * Enhanced fallback recipe parser with better text analysis
 */
const createEnhancedFallbackRecipe = (text: string): RecipeData => {
  // Split into lines and paragraphs for better analysis
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const paragraphs = text.split('\n\n').filter(para => para.trim().length > 0);
  
  // Extract title with better heuristics
  const title = extractTitle(lines, text) || 'Untitled Recipe';
  
  // Extract ingredients with better pattern matching
  const ingredients = extractIngredients(lines);
  
  // Extract instructions with improved paragraph and numbered list detection
  const instructions = extractInstructions(lines, paragraphs);
  
  // Try to identify prep/cook times
  const times = extractTimes(text);
  
  // Try to extract tips
  const tips = extractTips(text);
  
  return {
    title,
    introduction: extractIntroduction(paragraphs, title) || "This recipe was converted using advanced text parsing.",
    ingredients: ingredients.length > 0 ? ingredients : ['Ingredients could not be automatically detected'],
    instructions: instructions.length > 0 ? instructions : ['Instructions could not be automatically detected'],
    prepTime: times.prepTime,
    restTime: times.restTime,
    bakeTime: times.bakeTime,
    totalTime: times.totalTime,
    tips: tips.length > 0 ? tips : ['This recipe was parsed using an enhanced text converter. Review for accuracy.'],
    proTips: [],
    equipmentNeeded: extractEquipment(text),
    tags: generateTags(text, title),
    isPublic: false,
    isConverted: true
  };
};

/**
 * Extract title from text with better heuristics
 */
const extractTitle = (lines: string[], fullText: string): string | null => {
  // Check for obvious title patterns
  const titlePatterns = [
    /^#\s+(.+)$/i,                   // Markdown title
    /^(.+)\s+Recipe$/i,              // Something Recipe
    /^(.+)\s+Bread$/i,               // Something Bread
    /^How\s+to\s+Make\s+(.+)$/i,     // How to Make X
  ];
  
  // Try to find a title using patterns
  for (const pattern of titlePatterns) {
    for (const line of lines.slice(0, 5)) { // Check first 5 lines
      const match = line.match(pattern);
      if (match && match[1] && match[1].length < 60) {
        return match[1].trim();
      }
    }
  }
  
  // If no pattern match, use the first short line that's not "ingredients" or "instructions"
  for (const line of lines.slice(0, 5)) {
    const lower = line.toLowerCase();
    if (line.length > 3 && line.length < 60 && 
        !lower.includes('ingredient') && 
        !lower.includes('instruction') &&
        !lower.includes('direction') &&
        !lower.includes('step')) {
      return line.trim();
    }
  }
  
  // If we found nothing obvious, check for bread type words in the text
  const breadTypes = ['sourdough', 'challah', 'rye', 'focaccia', 'ciabatta', 'baguette', 'brioche', 'loaf'];
  for (const breadType of breadTypes) {
    if (fullText.toLowerCase().includes(breadType)) {
      // Look for phrases near this bread type
      const regex = new RegExp(`([\\w\\s]{3,30})${breadType}([\\w\\s]{0,30})`, 'i');
      const match = fullText.match(regex);
      if (match) {
        const phrase = (match[1] + breadType + match[2]).replace(/^\s+|\s+$/g, '');
        if (phrase.length < 60) {
          return phrase;
        }
      }
      
      // If no specific phrase, create a title from the bread type
      return breadType.charAt(0).toUpperCase() + breadType.slice(1) + ' Bread';
    }
  }
  
  return null;
};

/**
 * Extract ingredients with better pattern matching
 */
const extractIngredients = (lines: string[]): string[] => {
  const ingredients: string[] = [];
  let inIngredientsSection = false;
  
  // Regular expressions for identifying ingredient lines
  const ingredientPatterns = [
    /^\s*[\-•*]\s+(.+)/,                         // Bullet points
    /^\s*(\d+[\d\/]*)[\s\-]+(cup|tbsp|tsp|g|oz|lb|pound|ml|l|teaspoon|tablespoon)s?/i, // Measurements
    /^\s*(\d+)\s+(?:large|small|medium)?\s*(.+)/,  // Numbers of items
    /^\s*([½⅓¼⅔¾]+)\s+(cup|tbsp|tsp)/i,          // Unicode fractions
  ];
  
  // Identify the ingredients section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Detect ingredients section header
    if (!inIngredientsSection && 
        (lowerLine === 'ingredients' || 
         lowerLine.includes('ingredients:') || 
         lowerLine.includes('you will need:') ||
         lowerLine.includes('you\'ll need:'))) {
      inIngredientsSection = true;
      continue;
    }
    
    // Detect end of ingredients section (beginning of instructions)
    if (inIngredientsSection && 
        (lowerLine === 'instructions' || 
         lowerLine === 'directions' || 
         lowerLine.includes('instructions:') || 
         lowerLine.includes('directions:') ||
         lowerLine.includes('method:') ||
         lowerLine.match(/^step\s+1[\:\.]/i))) {
      inIngredientsSection = false;
      continue;
    }
    
    // If we're in the ingredients section or the line looks like an ingredient, add it
    if (inIngredientsSection || 
        ingredientPatterns.some(pattern => pattern.test(line)) ||
        (line.match(/^\s*[\d\/]+\s+/) && line.length < 80) ||
        (line.length < 50 && 
         (line.includes('flour') || 
          line.includes('sugar') || 
          line.includes('salt') || 
          line.includes('water') || 
          line.includes('butter') || 
          line.includes('egg') ||
          line.includes('yeast')))) {
      
      // Don't add section headers or empty lines
      if (line && 
          !lowerLine.includes('ingredient') && 
          lowerLine !== 'for the dough' &&
          lowerLine !== 'for the filling' &&
          lowerLine !== 'for the topping' &&
          line.length > 1) {
        ingredients.push(line);
      }
    }
  }
  
  return ingredients;
};

/**
 * Extract instructions with improved paragraph and numbered list detection
 */
const extractInstructions = (lines: string[], paragraphs: string[]): string[] => {
  const instructions: string[] = [];
  let inInstructionsSection = false;
  
  // Check for numbered steps
  const numberedInstructions = lines.filter(line => 
    /^\s*\d+[\.\)]\s+.+/.test(line) ||
    /^\s*Step\s+\d+[\.\:]\s+.+/i.test(line)
  );
  
  if (numberedInstructions.length >= 3) {
    return numberedInstructions;
  }
  
  // Look for an instructions section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Detect instructions section header
    if (!inInstructionsSection && 
        (lowerLine === 'instructions' || 
         lowerLine === 'directions' || 
         lowerLine.includes('instructions:') || 
         lowerLine.includes('directions:') ||
         lowerLine.includes('method:') ||
         lowerLine.match(/^step\s+1[\:\.]/i))) {
      inInstructionsSection = true;
      continue;
    }
    
    // If we're in the instructions section and have a non-empty line, add it
    if (inInstructionsSection && line && !lowerLine.includes('ingredients')) {
      // Check if this is a new step (bullet, number) or continuation
      if (/^\s*[\-•*]\s+/.test(line) || /^\s*\d+[\.\)]\s+/.test(line) || /^\s*Step\s+\d+/i.test(line)) {
        instructions.push(line);
      } else if (instructions.length > 0 && line.length < 5) {
        // Skip very short lines in the middle of instructions
        continue;
      } else if (instructions.length > 0 && line.length < 300) {
        // Append to previous instruction if it seems like a continuation
        if (line.length < 20 && !line.endsWith('.') && 
            !line.endsWith('?') && !line.endsWith('!')) {
          instructions[instructions.length - 1] += ' ' + line;
        } else {
          instructions.push(line);
        }
      }
    }
  }
  
  // If we didn't find explicit instructions, try to use paragraphs after ingredients
  if (instructions.length < 2) {
    // Find paragraphs that look like instructions (longer text, after any ingredients)
    const instructionParagraphs = paragraphs.filter(para => {
      const lowerPara = para.toLowerCase();
      return para.length > 80 && 
             !lowerPara.includes('ingredient') &&
             (lowerPara.includes('mix') || 
              lowerPara.includes('add') || 
              lowerPara.includes('stir') || 
              lowerPara.includes('bake') ||
              lowerPara.includes('heat') ||
              lowerPara.includes('combine'));
    });
    
    if (instructionParagraphs.length > 0) {
      return instructionParagraphs;
    }
  }
  
  return instructions;
};

/**
 * Extract introduction from paragraphs
 */
const extractIntroduction = (paragraphs: string[], title: string): string | null => {
  // Look for a short paragraph near the beginning
  for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
    const para = paragraphs[i].trim();
    const lowerPara = para.toLowerCase();
    
    // Skip paragraphs that look like section headers
    if (lowerPara === 'ingredients' || 
        lowerPara === 'instructions' || 
        lowerPara === 'directions' ||
        lowerPara.includes('ingredients:') || 
        lowerPara.includes('instructions:') || 
        lowerPara.includes('directions:')) {
      continue;
    }
    
    // Check if paragraph looks like an introduction (shorter, doesn't contain step-by-step instructions)
    if (para.length > 30 && para.length < 500 &&
        !lowerPara.includes('step 1') &&
        !lowerPara.match(/^\d+\.\s+/) &&
        !lowerPara.includes('preheat the oven') &&
        !lowerPara.includes('ingredients') &&
        !lowerPara.includes('equipment')) {
      return para;
    }
  }
  
  // If no introduction found, generate a basic one
  return `This ${title} recipe was automatically converted from text.`;
};

/**
 * Extract preparation, rest, bake, and total times
 */
const extractTimes = (text: string): { prepTime: string; restTime: string; bakeTime: string; totalTime: string } => {
  const times = {
    prepTime: '',
    restTime: '',
    bakeTime: '',
    totalTime: ''
  };
  
  // Look for prep time
  const prepMatch = text.match(/prep(?:aration)?\s*time:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i) ||
                    text.match(/preparation:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i);
  if (prepMatch) {
    times.prepTime = prepMatch[1];
  }
  
  // Look for rest/proof time
  const restMatch = text.match(/rest(?:ing)?\s*time:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i) ||
                    text.match(/proof(?:ing)?\s*time:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i) ||
                    text.match(/rise\s*(?:time|for):?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i);
  if (restMatch) {
    times.restTime = restMatch[1];
  }
  
  // Look for bake time
  const bakeMatch = text.match(/bak(?:e|ing)\s*time:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i) ||
                    text.match(/cook(?:ing)?\s*time:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i);
  if (bakeMatch) {
    times.bakeTime = bakeMatch[1];
  }
  
  // Look for total time
  const totalMatch = text.match(/total\s*time:?\s*(\d+\s*(?:min|minute|hour|hr)s?)/i);
  if (totalMatch) {
    times.totalTime = totalMatch[1];
  }
  
  return times;
};

/**
 * Extract tips from text
 */
const extractTips = (text: string): string[] => {
  const tips: string[] = [];
  const lines = text.split('\n');
  
  let inTipsSection = false;
  
  // Look for tips section
  for (const line of lines) {
    const trimmedLine = line.trim();
    const lowerLine = trimmedLine.toLowerCase();
    
    if (!inTipsSection && 
        (lowerLine === 'tips' || 
         lowerLine.includes('tips:') || 
         lowerLine.includes('notes:') ||
         lowerLine.includes('chef\'s tips'))) {
      inTipsSection = true;
      continue;
    }
    
    if (inTipsSection && trimmedLine) {
      // Exit tips section if we hit a new section header
      if (lowerLine === 'ingredients' || 
          lowerLine === 'instructions' || 
          lowerLine === 'directions' ||
          lowerLine.includes('ingredients:') || 
          lowerLine.includes('instructions:') || 
          lowerLine.includes('directions:')) {
        break;
      }
      
      // Add the tip if it's not too short
      if (trimmedLine.length > 10) {
        tips.push(trimmedLine);
      }
    }
  }
  
  // If no tips section found, look for tip-like sentences
  if (tips.length === 0) {
    const tipPhrases = [
      'for best results',
      'tip:',
      'note:',
      'important:',
      'you can ',
      'try to',
      'make sure',
      'don\'t forget'
    ];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (tipPhrases.some(phrase => lowerLine.includes(phrase)) && 
          line.length > 20 && line.length < 200) {
        tips.push(line.trim());
      }
    }
  }
  
  return tips;
};

/**
 * Extract equipment needed from text
 */
const extractEquipment = (text: string): { name: string }[] => {
  const equipmentList: { name: string }[] = [];
  const lowerText = text.toLowerCase();
  
  // Common baking equipment to look for
  const commonEquipment = [
    'stand mixer', 'mixer', 'dutch oven', 'baking stone', 'baking sheet', 'loaf pan', 
    'proofing basket', 'banneton', 'bread knife', 'thermometer', 'scale', 'measuring cup',
    'mixing bowl', 'dough scraper', 'parchment paper', 'cooling rack'
  ];
  
  // Check for each piece of equipment in the text
  for (const item of commonEquipment) {
    if (lowerText.includes(item)) {
      equipmentList.push({ name: item.charAt(0).toUpperCase() + item.slice(1) });
    }
  }
  
  return equipmentList;
};

/**
 * Generate tags based on recipe content
 */
const generateTags = (text: string, title: string): string[] => {
  const tags: string[] = ['converted-recipe'];
  const lowerText = text.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  // Common bread types
  const breadTypes = [
    'sourdough', 'challah', 'rye', 'focaccia', 'ciabatta', 'baguette', 'brioche', 
    'flatbread', 'pita', 'naan', 'bagel', 'pretzel', 'sandwich', 'loaf'
  ];
  
  // Check for each bread type in title and text
  for (const breadType of breadTypes) {
    if (lowerTitle.includes(breadType) || lowerText.includes(breadType)) {
      tags.push(breadType);
    }
  }
  
  // Check for dietary tags
  if (lowerText.includes('gluten-free') || lowerText.includes('gluten free')) {
    tags.push('gluten-free');
  }
  
  if (lowerText.includes('vegan')) {
    tags.push('vegan');
  }
  
  if (lowerText.includes('whole wheat') || lowerText.includes('whole-wheat')) {
    tags.push('whole-wheat');
  }
  
  // Check for difficulty level
  if (lowerText.includes('beginner') || 
      lowerText.includes('easy') || 
      lowerText.includes('simple')) {
    tags.push('easy');
  } else if (lowerText.includes('advanced') || 
             lowerText.includes('difficult') || 
             lowerText.includes('challenging')) {
    tags.push('advanced');
  }
  
  return tags;
};

/**
 * Basic fallback recipe parser when AI conversion fails
 */
const createFallbackRecipe = (text: string): RecipeData => {
  // Very basic parsing of ingredients and instructions
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Try to extract a title from the first line
  const title = lines.length > 0 ? lines[0].trim() : 'Untitled Recipe';
  
  // Basic ingredient detection (lines with quantities or common ingredients)
  const ingredients = lines.filter(line => {
    const trimmedLine = line.trim().toLowerCase();
    return (
      /\d+\s*(?:cup|tbsp|tsp|oz|g|kg|ml|l|pound|lb|teaspoon|tablespoon)s?/.test(trimmedLine) ||
      /butter|flour|sugar|salt|egg|milk|water|oil|vanilla|baking|yeast/.test(trimmedLine)
    );
  });
  
  // Assume instructions are longer text paragraphs or numbered lines
  const instructions = lines.filter(line => {
    const trimmedLine = line.trim();
    return (
      (trimmedLine.length > 40 && !ingredients.includes(line)) ||
      /^\d+[\.\)]/.test(trimmedLine) || // Numbered lists
      /^step\s+\d+/i.test(trimmedLine)  // Lines starting with "Step X"
    );
  });
  
  return {
    title: title,
    introduction: "This recipe was converted using basic text parsing because AI conversion wasn't available.",
    ingredients: ingredients.length > 0 ? ingredients : ['Ingredients could not be automatically detected'],
    instructions: instructions.length > 0 ? instructions : ['Instructions could not be automatically detected'],
    prepTime: '',
    restTime: '',
    bakeTime: '',
    totalTime: '',
    tips: ['This recipe was parsed using a simple text converter. You may need to edit it for accuracy.'],
    proTips: [],
    equipmentNeeded: [],
    tags: ['converted-recipe'],
    isPublic: false,
    isConverted: true
  };
};
