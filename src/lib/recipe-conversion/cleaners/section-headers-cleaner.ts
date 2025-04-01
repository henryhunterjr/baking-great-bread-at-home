/**
 * Fix and standardize recipe section headers
 * to improve structure detection and formatting
 */
export const fixSectionHeaders = (text: string): string => {
  if (!text) return '';
  
  let cleaned = text;
  
  // Define common recipe section headers and their standardized forms
  const sectionHeaders: Record<string, string> = {
    // Ingredients section headers
    'ingredients:': 'INGREDIENTS:',
    'ingredients list:': 'INGREDIENTS:',
    'ingredient list:': 'INGREDIENTS:',
    'you will need:': 'INGREDIENTS:',
    'you\'ll need:': 'INGREDIENTS:',
    'what you need:': 'INGREDIENTS:',
    
    // Instructions section headers
    'instructions:': 'INSTRUCTIONS:',
    'directions:': 'INSTRUCTIONS:',
    'method:': 'INSTRUCTIONS:',
    'preparation:': 'INSTRUCTIONS:',
    'steps:': 'INSTRUCTIONS:',
    'how to make:': 'INSTRUCTIONS:',
    'how to prepare:': 'INSTRUCTIONS:',
    
    // Other common recipe sections
    'prep time:': 'PREP TIME:',
    'cook time:': 'COOK TIME:',
    'cooking time:': 'COOK TIME:',
    'baking time:': 'BAKE TIME:',
    'bake time:': 'BAKE TIME:',
    'total time:': 'TOTAL TIME:',
    'servings:': 'SERVINGS:',
    'serves:': 'SERVINGS:',
    'yield:': 'SERVINGS:',
    'makes:': 'SERVINGS:',
    'notes:': 'NOTES:',
    'tips:': 'TIPS:',
    'equipment:': 'EQUIPMENT:',
    'tools:': 'EQUIPMENT:',
    'kitchen tools:': 'EQUIPMENT:',
    'utensils:': 'EQUIPMENT:',
    'nutrition:': 'NUTRITION:',
    'nutritional info:': 'NUTRITION:',
    'nutritional information:': 'NUTRITION:',
  };
  
  // Standardize section headers
  for (const [pattern, replacement] of Object.entries(sectionHeaders)) {
    // Case-insensitive replace using regex
    const regex = new RegExp(`(^|\\n)\\s*${pattern}\\s*`, 'i');
    cleaned = cleaned.replace(regex, `$1\n\n${replacement}\n\n`);
  }
  
  // Fix numbered steps format for better parsing
  cleaned = cleaned.replace(/(\n|\b)(\d+)\.\s*/g, '$1$2. ');
  
  // Format list items consistently
  cleaned = cleaned.replace(/(\n|\b)[-•*]\s*/g, '$1- ');
  
  // Ensure double newlines before section headers for clear separation
  for (const replacement of Object.values(sectionHeaders)) {
    cleaned = cleaned.replace(new RegExp(`([^\\n])(\\n${replacement})`, 'g'), '$1\n\n$2');
  }
  
  return cleaned;
};
