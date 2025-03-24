
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MediaPageHeaderProps {
  title: string;
  description: string;
  heroImageUrl?: string;
}

const MediaPageHeader: React.FC<MediaPageHeaderProps> = ({ 
  title, 
  description, 
  heroImageUrl 
}) => {
  if (heroImageUrl) {
    return (
      <div className="mb-10">
        <div className="relative rounded-lg overflow-hidden mb-6">
          <AspectRatio ratio={21/9} className="bg-muted">
            <img 
              src={heroImageUrl} 
              alt={title}
              className="object-cover w-full h-full" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-8 pt-36">
              <div className="relative z-10 max-w-3xl">
                <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4 text-white drop-shadow-md">{title}</h1>
                <p className="text-xl text-white/90 drop-shadow-md">
                  {description}
                </p>
              </div>
            </div>
          </AspectRatio>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default MediaPageHeader;
