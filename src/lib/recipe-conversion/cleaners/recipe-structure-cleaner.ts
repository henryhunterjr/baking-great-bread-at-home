
/**
 * Detect and fix recipe structure issues
 * to improve parsing and organization
 */
export const detectAndFixRecipeStructure = (text: string): string => {
  if (!text) return '';
  
  let cleaned = text;
  
  // 1. Identify if the text contains structured recipe sections
  const hasIngredients = /ingredients:?|you(?:'ll)? need:?/i.test(cleaned);
  const hasInstructions = /instructions:?|directions:?|method:?|steps:?|preparation:?/i.test(cleaned);
  
  // 2. If missing structured sections, try to detect and add them
  if (!hasIngredients || !hasInstructions) {
    const lines = cleaned.split('\n');
    let structuredText = '';
    let inIngredientSection = false;
    let ingredientSectionFound = hasIngredients;
    let instructionSectionFound = hasInstructions;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        structuredText += '\n';
        continue;
      }
      
      // Try to detect ingredient lines if we haven't found ingredients section yet
      if (!ingredientSectionFound) {
        // Check for patterns that look like ingredients (measurements + food items)
        const isIngredientLine = /^\d+[\s\/]*(cup|tbsp|tsp|oz|g|kg|ml|l|lb|pound|tablespoon|teaspoon)s?\b/i.test(line) || 
                                 /^\d+[\s\/]*(.+)/.test(line) && line.length < 80;
        
        if (isIngredientLine && !inIngredientSection) {
          structuredText += "\n\nINGREDIENTS:\n\n";
          inIngredientSection = true;
          ingredientSectionFound = true;
        }
      }
      
      // Try to detect instruction lines if we were in ingredients section
      if (inIngredientSection && !instructionSectionFound) {
        // Patterns that might indicate instructions (numbered steps, longer paragraphs, etc.)
        const isInstructionLine = line.match(/^(step|[0-9]+\.)/) || 
                                 (line.length > 80 && !line.includes(',')) || 
                                 line.includes(' for ') || line.includes(' until ');
        
        if (isInstructionLine) {
          structuredText += "\n\nINSTRUCTIONS:\n\n";
          inIngredientSection = false;
          instructionSectionFound = true;
        }
      }
      
      structuredText += line + '\n';
    }
    
    if (structuredText.trim() !== cleaned.trim()) {
      cleaned = structuredText;
    }
  }
  
  // 3. Ensure consistent formatting
  // Add blank lines before section headers for better readability
  cleaned = cleaned.replace(/([^\n])\n(INGREDIENTS:|INSTRUCTIONS:|EQUIPMENT:|NOTES:|TIPS:)/gi, '$1\n\n$2');
  
  // Ensure section headers are in uppercase with a colon
  cleaned = cleaned.replace(/\b(ingredients|instructions|directions|method|equipment|notes|tips)\b:?/gi, (match) => {
    return match.toUpperCase().endsWith(':') ? match.toUpperCase() : match.toUpperCase() + ':';
  });
  
  // Fix steps formatting
  cleaned = cleaned.replace(/\n(\d+)[.)\s-]+/g, '\n$1. ');
  
  return cleaned;
};
