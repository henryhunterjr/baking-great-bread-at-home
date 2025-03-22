
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import RecipeUploader from './RecipeUploader';
import { RecipeData } from '@/pages/RecipeConverter';
import { v4 as uuidv4 } from 'uuid';

interface ConversionServiceProps {
  onConversionComplete: (recipe: RecipeData) => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ onConversionComplete }) => {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);

  const handleConversion = async (text: string) => {
    setIsConverting(true);
    
    try {
      // Simulate AI processing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock recipe data (replace with actual conversion logic)
      const convertedRecipe: RecipeData = {
        title: 'Classic Sourdough Bread',
        introduction: 'This treasured recipe was passed down from my grandmother. The coffee stains on the original card remind me of Sunday mornings in her kitchen.',
        ingredients: [
          '500g (4 cups) bread flour',
          '350g (1 1/2 cups) water',
          '100g (1/2 cup) active sourdough starter',
          '10g (2 tsp) salt'
        ],
        prepTime: '30 minutes',
        restTime: '12-14 hours',
        bakeTime: '45 minutes',
        totalTime: '13-15 hours',
        instructions: [
          'Mix flour and water until no dry spots remain. Cover and rest for 30 minutes.',
          'Add starter and salt, then perform stretch and folds until dough becomes elastic.',
          'Cover and let rise at room temperature for 3-4 hours, performing stretch and folds every 30 minutes for the first 2 hours.',
          'Shape the dough into a boule or batard and place in a floured banneton.',
          'Refrigerate overnight (8-10 hours) for slow fermentation.',
          'Preheat oven to 500°F (260°C) with Dutch oven inside for 1 hour.',
          'Score dough and bake covered for 20 minutes, then uncovered for 20-25 minutes until deep golden brown.',
          'Cool completely on a wire rack before slicing.'
        ],
        tips: [
          'The dough should increase in volume by about 30-50% during bulk fermentation.',
          'If you don\'t have a Dutch oven, use a baking stone with a metal bowl as a cover.',
          'The bread is done when it sounds hollow when tapped on the bottom.'
        ],
        proTips: [
          'For a more open crumb, increase hydration to 75-80% once you\'re comfortable with the process.',
          'Try cold autolyse by mixing flour and water and refrigerating overnight before adding starter.',
          'Use rice flour for dusting your banneton to prevent sticking.'
        ],
        equipmentNeeded: [
          { id: uuidv4(), name: 'Dutch Oven', affiliateLink: '/tools/dutch-oven' },
          { id: uuidv4(), name: 'Banneton Basket', affiliateLink: '/tools/banneton' },
          { id: uuidv4(), name: 'Bread Lame', affiliateLink: '/tools/bread-lame' },
          { id: uuidv4(), name: 'Kitchen Scale', affiliateLink: '/tools/kitchen-scale' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
        tags: ['sourdough', 'bread', 'artisan', 'traditional'],
        isPublic: false,
        isConverted: true
      };
      
      onConversionComplete(convertedRecipe);
      
      toast({
        title: "Recipe Converted!",
        description: "Your recipe has been successfully converted. You can now edit, save, or print it.",
      });
    } catch (error) {
      console.error("Error converting recipe:", error);
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "We couldn't convert your recipe. Please try again or use a different format.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <RecipeUploader 
      onConvertRecipe={handleConversion} 
      isConverting={isConverting} 
    />
  );
};

export default ConversionService;
