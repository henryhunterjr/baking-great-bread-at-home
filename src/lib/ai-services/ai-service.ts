
import { Recipe } from '@/types/recipe';
import { v4 as uuidv4 } from 'uuid';

/**
 * Process recipe text and convert it to structured recipe data
 */
export const processRecipeText = async (text: string): Promise<Recipe> => {
  // In a real implementation, this would call an AI service API
  // For now, we'll simulate AI processing with a timeout
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Parse recipe text (simplified parser)
  const lines = text.split('\n').filter(line => line.trim());
  
  let title = 'Untitled Recipe';
  const ingredients: Array<{ name: string; quantity: string; unit: string }> = [];
  const steps: string[] = [];
  const tags: string[] = ['bread', 'baking'];
  
  // Extract title (assume first line is title)
  if (lines.length > 0) {
    title = lines[0];
  }
  
  // Simple parsing logic - in real app, would be much more robust with AI
  let currentSection = '';
  for (const line of lines.slice(1)) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('ingredient')) {
      currentSection = 'ingredients';
      continue;
    } else if (lowerLine.includes('instruction') || lowerLine.includes('direction')) {
      currentSection = 'steps';
      continue;
    }
    
    if (currentSection === 'ingredients') {
      // Simple ingredient parsing
      if (line.includes('-') || line.includes('•')) {
        const parts = line.replace(/^[-•]\s*/, '').trim().split(' ');
        
        if (parts.length >= 2) {
          const quantity = parts[0].trim();
          
          // Try to extract unit (g, ml, cups, etc.)
          let unit = '';
          let nameStartIndex = 1;
          
          if (parts[1].match(/^[a-zA-Z]+$/)) {
            unit = parts[1].trim();
            nameStartIndex = 2;
          }
          
          const name = parts.slice(nameStartIndex).join(' ').trim();
          
          ingredients.push({
            name,
            quantity,
            unit
          });
        }
      }
    } else if (currentSection === 'steps') {
      // Step parsing
      if (line.match(/^\d+\./) || line.includes('.')) {
        steps.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    }
  }
  
  // Add some default tags based on content
  if (text.toLowerCase().includes('sourdough')) {
    tags.push('sourdough');
  }
  if (text.toLowerCase().includes('whole wheat')) {
    tags.push('whole wheat');
  }
  
  // Create structured recipe
  return {
    title,
    description: `A delicious ${title.toLowerCase()} recipe.`,
    servings: 1,
    prepTime: 30,
    cookTime: 45,
    ingredients,
    steps,
    tags,
    notes: '',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    author: 'AI Assistant',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false
  };
};

/**
 * Generate a recipe from a prompt
 */
export const generateRecipe = async (prompt: string): Promise<Recipe> => {
  // In a real implementation, this would call an AI service API
  // For now, we'll simulate AI processing with a timeout
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract key terms from prompt
  const lowercasePrompt = prompt.toLowerCase();
  const hasHerbs = lowercasePrompt.includes('herb') || lowercasePrompt.includes('rosemary') || lowercasePrompt.includes('thyme');
  const hasCheese = lowercasePrompt.includes('cheese');
  const isWhole = lowercasePrompt.includes('whole') || lowercasePrompt.includes('wheat') || lowercasePrompt.includes('grain');
  const isSourdough = lowercasePrompt.includes('sourdough');
  
  // Generate title based on prompt
  let title = 'Artisan Bread';
  if (isSourdough) {
    title = hasHerbs ? 'Rustic Herb Sourdough' : 'Classic Sourdough Bread';
  } else if (isWhole) {
    title = 'Whole Wheat Country Loaf';
  } else if (hasHerbs && hasCheese) {
    title = 'Herb and Cheese Artisan Bread';
  } else if (hasHerbs) {
    title = 'Herb-Infused Crusty Bread';
  } else if (hasCheese) {
    title = 'Cheesy Bakery Bread';
  }
  
  // Generate tags based on prompt
  const tags = ['bread', 'baking'];
  if (isSourdough) tags.push('sourdough');
  if (isWhole) tags.push('whole wheat');
  if (hasHerbs) tags.push('herbs');
  if (hasCheese) tags.push('cheese');
  
  // Generate ingredients
  const ingredients = [
    {
      name: isWhole ? 'whole wheat flour' : 'bread flour',
      quantity: '500',
      unit: 'g'
    },
    {
      name: 'water',
      quantity: isWhole ? '375' : '350',
      unit: 'g'
    },
    {
      name: isSourdough ? 'active sourdough starter' : 'instant yeast',
      quantity: isSourdough ? '100' : '7',
      unit: 'g'
    },
    {
      name: 'salt',
      quantity: '10',
      unit: 'g'
    }
  ];
  
  // Add herbs if requested
  if (hasHerbs) {
    ingredients.push({
      name: 'fresh rosemary, chopped',
      quantity: '2',
      unit: 'tbsp'
    });
  }
  
  // Add cheese if requested
  if (hasCheese) {
    ingredients.push({
      name: 'grated Parmesan cheese',
      quantity: '80',
      unit: 'g'
    });
  }
  
  // Generate steps
  const steps = [
    isSourdough 
      ? 'Mix flour and water until no dry spots remain. Cover and rest for 30 minutes (autolyse).'
      : 'Mix flour, water, yeast, and salt until no dry spots remain.',
    
    isSourdough
      ? 'Add starter and salt, then perform stretch and folds until dough becomes elastic.'
      : 'Knead the dough for 8-10 minutes until smooth and elastic.',
    
    hasHerbs || hasCheese
      ? `Fold in the ${hasHerbs ? 'herbs' : ''}${hasHerbs && hasCheese ? ' and ' : ''}${hasCheese ? 'cheese' : ''} until evenly distributed throughout the dough.`
      : 'Shape the dough into a ball and place in an oiled bowl.',
    
    isSourdough
      ? 'Cover and let rise at room temperature for 4-6 hours, performing stretch and folds every 30 minutes for the first 2 hours.'
      : 'Cover and let rise in a warm place for 1-2 hours, or until doubled in size.',
    
    'Shape the dough into a boule or batard and place in a floured banneton or proofing basket.',
    
    isSourdough
      ? 'Refrigerate overnight (8-12 hours) for slow fermentation and flavor development.'
      : 'Let the dough proof for 1 hour or until it has visibly expanded.',
    
    'Preheat oven to 475°F (245°C) with Dutch oven inside for 45-60 minutes.',
    
    'Score the dough with a sharp blade and carefully transfer to the hot Dutch oven.',
    
    'Bake covered for 20 minutes, then uncover and bake for an additional 20-25 minutes until deep golden brown.',
    
    'Cool completely on a wire rack before slicing to allow the crumb to set.'
  ];
  
  return {
    title,
    description: `A delicious ${title.toLowerCase()} made with ${hasHerbs ? 'aromatic herbs' : 'simple ingredients'}${hasCheese ? ' and savory cheese' : ''}.`,
    servings: 1,
    prepTime: isSourdough ? 45 : 25,
    cookTime: 45,
    ingredients,
    steps,
    tags,
    notes: isSourdough 
      ? 'For best results, use a starter that has been recently fed and is at peak activity.'
      : 'The bread is done when it sounds hollow when tapped on the bottom.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    author: 'AI Assistant',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false
  };
};
