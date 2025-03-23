
import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface RecipeImageProps {
  id: string | number;
  imageUrl: string;
  title: string;
  isHovered: boolean;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ id, imageUrl, title, isHovered }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  // Reset image status when recipe changes
  useEffect(() => {
    setImageStatus('loading');
  }, [id, imageUrl]);

  // Fallback image - we'll use a consistent one that is known to work
  const fallbackImage = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
  
  const handleImageLoad = () => {
    console.log(`Image loaded successfully for recipe ${id}: ${title}`);
    setImageStatus('loaded');
  };

  const handleImageError = () => {
    console.log(`Image error for recipe ${id}: ${title}`);
    console.log(`Image URL that failed: ${imageUrl}`);
    setImageStatus('error');
  };

  // Determine which image URL to use
  const displayImageUrl = imageStatus === 'error' ? fallbackImage : imageUrl;

  return (
    <div className="aspect-video overflow-hidden bg-bread-100 relative">
      {/* Loading indicator shown only when in loading state */}
      {imageStatus === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-bread-100">
          <div className="w-10 h-10 border-4 border-bread-300 border-t-bread-800 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state - only shown when image has failed to load */}
      {imageStatus === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bread-100">
          <ImageOff className="h-10 w-10 text-bread-400 mb-2" />
          <p className="text-sm text-bread-500">Image unavailable</p>
        </div>
      )}
      
      {/* Image - we always render it but control opacity based on status */}
      <img
        id={`recipe-img-${id}`}
        src={displayImageUrl}
        alt={title}
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

export default RecipeImage;
