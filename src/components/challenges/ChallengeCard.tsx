
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getChallengeImage } from '@/services/blog/imageUtils';
import { Challenge } from '@/types/challengeTypes';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ChallengeCardProps {
  challenge: Challenge;
  variant?: 'large' | 'small';
}

const ChallengeCard = ({ challenge, variant = 'small' }: ChallengeCardProps) => {
  const isLarge = variant === 'large';
  const [imageError, setImageError] = useState(false);
  
  // Get the image source based on the challenge ID
  const imageSrc = getChallengeImage(challenge.id);

  // Format the date for better readability
  const formattedDate = format(challenge.date, 'MMMM yyyy');

  return (
    <Card className="overflow-hidden border-bread-100 hover:shadow-md transition-all duration-300">
      <div className={`${isLarge ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col sm:flex-row h-full'}`}>
        <div className={`${isLarge ? 'aspect-video relative' : 'sm:w-1/3 relative'} overflow-hidden bg-bread-50`}>
          <AspectRatio ratio={16/9}>
            {!imageError ? (
              <img 
                src={imageSrc}
                alt={challenge.title} 
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                onError={() => {
                  console.log(`Error loading image for challenge: ${challenge.id}`);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-bread-100 p-4">
                <ImageIcon className="h-12 w-12 text-bread-400 mb-4" />
                <div className="text-center">
                  <p className="text-bread-600 text-base font-medium mb-2">{formattedDate}</p>
                  <h4 className="font-serif font-medium text-bread-800 text-lg md:text-xl">{challenge.title}</h4>
                  {challenge.hashtag && (
                    <p className="text-bread-700 font-medium text-base mt-2">{challenge.hashtag}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Overlay with challenge info even when image loads - REVERSED gradient direction */}
            {!imageError && (
              <div className="absolute inset-0 bg-gradient-to-b from-bread-950/80 to-transparent flex flex-col justify-start p-4 text-white">
                <p className="text-white/90 text-sm md:text-base font-medium">{formattedDate}</p>
                <h4 className="font-serif font-medium text-lg md:text-xl">{challenge.title}</h4>
                {challenge.hashtag && (
                  <p className="text-white/90 font-medium text-sm md:text-base mt-1">{challenge.hashtag}</p>
                )}
              </div>
            )}
          </AspectRatio>
        </div>
        
        <CardContent className={`p-${isLarge ? '6' : '4'} ${isLarge ? '' : 'sm:w-2/3'} flex flex-col justify-between`}>
          <div>
            <div className={`mb-${isLarge ? '2' : '1'} text-sm md:text-base text-bread-800 font-medium`}>
              {formattedDate}
            </div>
            <h3 className={`font-serif text-${isLarge ? '2xl' : 'xl'} font-medium mb-3`}>
              {challenge.title}
            </h3>
            {challenge.hashtag && (
              <div className={`text-bread-700 font-medium text-base mb-3`}>
                {challenge.hashtag}
              </div>
            )}
            <p className={`text-muted-foreground text-${isLarge ? 'base' : 'sm'} ${isLarge ? 'mb-6' : ''}`}>
              {challenge.description}
            </p>
          </div>
          <Button 
            variant={isLarge ? "default" : "outline"}
            size={isLarge ? "default" : "sm"}
            className={isLarge ? "bg-bread-800 hover:bg-bread-900 text-white w-fit mt-4" : "mt-4 border-bread-200 text-bread-800 hover:bg-bread-50 w-fit"}
            asChild
          >
            <a href={challenge.link} target="_blank" rel="noopener noreferrer">
              {isLarge ? 'Join This Challenge' : 'View Challenge'}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default ChallengeCard;
