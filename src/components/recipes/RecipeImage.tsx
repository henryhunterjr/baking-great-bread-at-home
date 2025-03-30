
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  return (
    <div className="relative overflow-hidden">
      <AspectRatio ratio={16/9}>
        <img
          src={imageUrl || `/placeholder-${(parseInt(id) % 5) + 1}.jpg`}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110 brightness-90' : 'scale-100'
          }`}
          loading="lazy"
        />
      </AspectRatio>
    </div>
  );
};

export default RecipeImage;
