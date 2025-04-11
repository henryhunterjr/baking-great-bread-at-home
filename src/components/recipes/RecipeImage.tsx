
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageService } from '@/utils/ImageService';

interface RecipeImageProps {
  id: string;
  imageUrl: string;
  title: string;
  isHovered: boolean;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ 
  id, 
  imageUrl, 
  title, 
  isHovered 
}) => {
  // Array of bread-related fallback images
  const breadFallbackImages = [
    'https://images.unsplash.com/photo-1585478259715-1c195ae2b568?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  ];

  // Get deterministic fallback image based on id
  const getFallbackImage = (recipeId: string): string => {
    // Generate a numeric hash from the id string
    const hash = recipeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = Math.abs(hash) % breadFallbackImages.length;
    return breadFallbackImages[index];
  };

  // Generate a placeholder based on id to ensure consistent fallbacks
  const placeholderImage = getFallbackImage(id);

  // Add uploaded image to be used in the recipe cards
  const newHeroImage = "/lovable-uploads/da5b9006-4aad-4bf1-89a8-83c3b3ebf7e0.png";
  
  // Use different images for banana bread, whole wheat, etc.
  const getSpecializedImage = (title: string, id: string): string => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('banana')) {
      if (lowerTitle.includes('chocolate')) {
        return 'https://images.unsplash.com/photo-1606884285898-277317a7bf12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      } else if (lowerTitle.includes('nut') || lowerTitle.includes('walnut')) {
        return 'https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      } else if (lowerTitle.includes('whole wheat')) {
        return 'https://images.unsplash.com/photo-1619173564606-0064c586452a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      }
      return 'https://images.unsplash.com/photo-1574087093774-8204801c0e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    }
    
    if (lowerTitle.includes('sourdough')) {
      return 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    }
    
    if (lowerTitle.includes('whole wheat') || lowerTitle.includes('honey')) {
      return 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    }
    
    if (lowerTitle.includes('artisan') || lowerTitle.includes('marbled')) {
      return 'https://images.unsplash.com/photo-1600423115867-87356b734350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    }
    
    // If no specialized image found, use the uploaded hero image for some recipes based on ID
    const numId = parseInt(id);
    if (numId % 5 === 0) {
      return newHeroImage;
    }
    
    // Default fallback
    return placeholderImage;
  };

  // Determine the image source with better fallbacks
  const finalImageUrl = imageUrl && imageUrl !== '' 
    ? imageUrl 
    : getSpecializedImage(title, id);

  return (
    <div className="relative overflow-hidden">
      <AspectRatio ratio={16/9}>
        <img
          src={finalImageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110 brightness-90' : 'scale-100'
          }`}
          loading="lazy"
          decoding="async"
          width="400"
          height="225"
          onError={(e) => {
            // If the image fails to load, try a specialized image first
            if (e.currentTarget.src !== getSpecializedImage(title, id)) {
              e.currentTarget.src = getSpecializedImage(title, id);
            } 
            // If that also fails (or was already tried), use the fallback
            else if (e.currentTarget.src !== placeholderImage) {
              e.currentTarget.src = placeholderImage;
            }
          }}
        />
      </AspectRatio>
    </div>
  );
};

export default RecipeImage;
