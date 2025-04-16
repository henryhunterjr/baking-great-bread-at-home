
export function getErrorSpecificPrompt(errorType: string, text: string): string {
  switch (errorType) {
    case 'pdf_extraction':
      return `This text was extracted from a PDF but may be poorly formatted. Please identify any recipe content and structure it properly:\n\n${text}`;
    case 'image_processing':
      return `This text came from OCR and may have errors. Please extract and correct recipe content:\n\n${text}`;
    case 'format_detection':
      return `The standard parser failed with this text. Please extract recipe data in a structured format:\n\n${text}`;
    default:
      return `Please try to parse this text into a recipe format with ingredients and instructions:\n\n${text}`;
  }
}

export function buildRecipePrompt(text: string, options = { detailed: false }): string {
  const basePrompt = 'Structure this recipe with quantities, instructions, and any special techniques:';
  const detailedPrompt = 'Convert this recipe text into a highly detailed structured format with precise quantities, detailed steps, and any special techniques or notes:';
  
  return `${options.detailed ? detailedPrompt : basePrompt}\n\n${text}`;
}
