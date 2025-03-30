
import React, { useState, useEffect, memo } from 'react';
import { ImageOff } from 'lucide-react';

interface RecipeImageProps {
  id: string | number;
  imageUrl: string;
  title: string;
  isHovered: boolean;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ id, imageUrl, title, isHovered }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState<string>(imageUrl);
  
  // Reset image status when recipe changes
  useEffect(() => {
    setImageStatus('loading');
    setCurrentSrc(imageUrl);
  }, [id, imageUrl]);

  // Enhanced array of reliable fallback images that are known to work well
  const fallbackImages = [
    "https://images.unsplash.com/photo-1586444248879-bc604cbd555a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1585478259715-1c195ae2b568?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  ];
  
  // Get a deterministic fallback image based on the recipe ID
  const getFallbackImage = () => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) || 0 : id;
    return fallbackImages[numericId % fallbackImages.length];
  };
  
  const handleImageLoad = () => {
    console.log(`Image loaded successfully for recipe ${id}: ${title}`);
    setImageStatus('loaded');
  };

  const handleImageError = () => {
    console.log(`Image error for recipe ${id}: ${title}`);
    console.log(`Image URL that failed: ${currentSrc}`);
    
    // If the current source is already a fallback image, try a different one
    if (fallbackImages.includes(currentSrc)) {
      // Try another fallback image
      const nextFallback = getFallbackImage();
      if (nextFallback !== currentSrc) {
        setCurrentSrc(nextFallback);
        return;
      }
    } else {
      // Try the fallback image
      setCurrentSrc(getFallbackImage());
      return;
    }
    
    // If we've tried all options, mark as error
    setImageStatus('error');
  };

  return (
    <div className="aspect-video overflow-hidden bg-bread-100 relative">
      {/* Loading indicator shown only when in loading state */}
      {imageStatus === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-bread-100" aria-hidden="true">
          <div className="w-10 h-10 border-4 border-bread-300 border-t-bread-800 rounded-full animate-spin" 
               role="progressbar" 
               aria-label="Loading image">
          </div>
        </div>
      )}
      
      {/* Error state - only shown when image has failed to load */}
      {imageStatus === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bread-100" aria-hidden="true">
          <ImageOff className="h-10 w-10 text-bread-400 mb-2" aria-hidden="true" />
          <p className="text-sm text-bread-500">Image unavailable</p>
        </div>
      )}
      
      {/* Image - we always render it but control opacity based on status */}
      <img
        id={`recipe-img-${id}`}
        src={currentSrc}
        alt={`Recipe: ${title}`}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

// Memoize the RecipeImage component to prevent unnecessary re-renders
export default memo(RecipeImage);
