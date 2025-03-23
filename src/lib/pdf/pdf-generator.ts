
import { jsPDF } from 'jspdf';
import { Recipe } from '@/types/recipe';

export const generateRecipePDF = (recipe: Recipe): jsPDF => {
  const doc = new jsPDF();
  
  // Set font sizes
  const titleFontSize = 18;
  const headerFontSize = 14;
  const bodyFontSize = 12;
  
  // Set initial position
  let yPosition = 20;
  const margin = 20;
  const lineHeight = 7;
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text(recipe.title, margin, yPosition);
  yPosition += lineHeight * 1.5;
  
  // Add description
  if (recipe.description) {
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'normal');
    
    const splitDescription = doc.splitTextToSize(recipe.description, 170);
    doc.text(splitDescription, margin, yPosition);
    yPosition += (splitDescription.length * lineHeight) + 5;
  }
  
  // Add cook times
  doc.setFontSize(bodyFontSize);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prep Time: ${recipe.prepTime} minutes | Cook Time: ${recipe.cookTime} minutes | Servings: ${recipe.servings}`, margin, yPosition);
  yPosition += lineHeight * 2;
  
  // Add ingredients
  doc.setFontSize(headerFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('Ingredients', margin, yPosition);
  yPosition += lineHeight * 1.5;
  
  doc.setFontSize(bodyFontSize);
  doc.setFont('helvetica', 'normal');
  
  recipe.ingredients.forEach(ingredient => {
    const ingredientText = `• ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`.trim();
    doc.text(ingredientText, margin + 5, yPosition);
    yPosition += lineHeight;
    
    // Add page if needed
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  yPosition += lineHeight;
  
  // Add instructions
  doc.setFontSize(headerFontSize);
  doc.setFont('helvetica', 'bold');
  doc.text('Instructions', margin, yPosition);
  yPosition += lineHeight * 1.5;
  
  doc.setFontSize(bodyFontSize);
  doc.setFont('helvetica', 'normal');
  
  recipe.steps.forEach((step, index) => {
    const stepText = `${index + 1}. ${step}`;
    const splitStep = doc.splitTextToSize(stepText, 170);
    
    doc.text(splitStep, margin, yPosition);
    yPosition += (splitStep.length * lineHeight) + 3;
    
    // Add page if needed
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Add notes if any
  if (recipe.notes) {
    yPosition += lineHeight;
    
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', margin, yPosition);
    yPosition += lineHeight * 1.5;
    
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'normal');
    
    const splitNotes = doc.splitTextToSize(recipe.notes, 170);
    doc.text(splitNotes, margin, yPosition);
  }
  
  return doc;
};

export const downloadRecipePDF = (recipe: Recipe): void => {
  const doc = generateRecipePDF(recipe);
  doc.save(`${recipe.title.replace(/\s+/g, '_')}.pdf`);
};

export const downloadRecipeText = (recipe: Recipe): void => {
  // Create text content
  let content = `${recipe.title}\n\n`;
  
  if (recipe.description) {
    content += `${recipe.description}\n\n`;
  }
  
  content += `Prep Time: ${recipe.prepTime} minutes | Cook Time: ${recipe.cookTime} minutes | Servings: ${recipe.servings}\n\n`;
  
  content += "INGREDIENTS:\n";
  recipe.ingredients.forEach(ingredient => {
    content += `• ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}\n`.trim();
  });
  
  content += "\nINSTRUCTIONS:\n";
  recipe.steps.forEach((step, index) => {
    content += `${index + 1}. ${step}\n`;
  });
  
  if (recipe.notes) {
    content += `\nNOTES:\n${recipe.notes}\n`;
  }
  
  // Create download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${recipe.title.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
