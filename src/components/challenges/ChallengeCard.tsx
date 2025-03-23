
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getChallengeImage } from '@/services/blog/imageUtils';
import { Challenge } from '@/types/challengeTypes';

interface ChallengeCardProps {
  challenge: Challenge;
  variant?: 'large' | 'small';
}

const ChallengeCard = ({ challenge, variant = 'small' }: ChallengeCardProps) => {
  const isLarge = variant === 'large';
  const [imageError, setImageError] = useState(false);
  
  // Get the image source based on the challenge ID
  const imageSrc = getChallengeImage(challenge.id);

  return (
    <Card className="overflow-hidden border-bread-100">
      <div className={`${isLarge ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col sm:flex-row h-full'}`}>
        <div className={`${isLarge ? 'aspect-video' : 'sm:w-1/3 aspect-video sm:aspect-auto'} overflow-hidden bg-bread-50 relative`}>
          {!imageError ? (
            <img 
              src={imageSrc}
              alt={challenge.title} 
              className="w-full h-full object-cover"
              onError={() => {
                console.log(`Error loading image for challenge: ${challenge.id}`);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-bread-100 p-4">
              <ImageIcon className="h-12 w-12 text-bread-400 mb-2" />
              <div className="text-center">
                <h4 className="font-medium text-bread-800">{challenge.title}</h4>
                {challenge.hashtag && (
                  <p className="text-bread-600 text-sm mt-1">{challenge.hashtag}</p>
                )}
              </div>
            </div>
          )}
        </div>
        <CardContent className={`p-${isLarge ? '6' : '4'} ${isLarge ? '' : 'sm:w-2/3'} flex flex-col justify-between`}>
          <div>
            <div className={`mb-${isLarge ? '2' : '1'} text-${isLarge ? 'sm' : 'xs'} text-bread-800 font-medium`}>
              {format(challenge.date, 'MMMM yyyy')}
            </div>
            <h3 className={`font-serif text-${isLarge ? '2xl' : 'lg'} font-medium mb-2`}>
              {challenge.title}
            </h3>
            {challenge.hashtag && (
              <div className={`text-bread-${isLarge ? '800' : '600'} font-medium text-${isLarge ? 'lg' : 'sm'} mb-${isLarge ? '3' : '1'}`}>
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
            className={isLarge ? "bg-bread-800 hover:bg-bread-900 text-white w-fit" : "mt-4 border-bread-200 text-bread-800 hover:bg-bread-50 w-fit"}
            asChild
          >
            <a href={challenge.link} target="_blank" rel="noopener noreferrer">
              {isLarge ? 'Join This Challenge' : 'View Challenge'}
              <ExternalLink className={`ml-2 h-${isLarge ? '4' : '3'} w-${isLarge ? '4' : '3'}`} />
            </a>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default ChallengeCard;
