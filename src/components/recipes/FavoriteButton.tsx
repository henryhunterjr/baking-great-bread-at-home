
import React from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  isFavorite: boolean;
  isHovered: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  isHovered, 
  onClick 
}) => {
  return (
    <div className="absolute top-3 right-3 z-10">
      <button 
        onClick={onClick}
        className={`p-2 rounded-full transition-all duration-300 ${
          isHovered || isFavorite 
            ? 'bg-white/80 shadow-md scale-110' 
            : 'bg-white/30'
        }`}
      >
        <Heart 
          className={`h-5 w-5 transition-all ${
            isFavorite 
              ? 'fill-bread-800 text-bread-800' 
              : 'text-bread-800/70 group-hover:text-bread-800'
          }`} 
        />
      </button>
    </div>
  );
};

export default FavoriteButton;
