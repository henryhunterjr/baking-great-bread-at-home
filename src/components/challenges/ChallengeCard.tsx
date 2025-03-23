
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getChallengeImage } from '@/services/blog/imageUtils';
import { DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';
import { Challenge } from '@/types/challengeTypes';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ChallengeCardProps {
  challenge: Challenge;
  variant?: 'large' | 'small';
}

// Helper to check if an image exists
const checkImageExists = (imageSrc: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image load success for: ${imageSrc}`);
      resolve(true);
    };
    img.onerror = () => {
      console.error(`❌ Image load failed for: ${imageSrc}`);
      resolve(false);
    };
    img.src = imageSrc;
  });
};

const ChallengeCard = ({ challenge, variant = 'small' }: ChallengeCardProps) => {
  const isLarge = variant === 'large';
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageTier, setImageTier] = useState<'configured' | 'gamma' | 'default' | 'error'>('default');
  const [isLoading, setIsLoading] = useState(true);
  
  // Format the date for better readability
  const formattedDate = format(challenge.date, 'MMMM yyyy');

  // Simplified image loading strategy
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setImageError(false);
      
      console.log(`🔍 [Challenge ${challenge.id}] Starting image load process`);
      
      // First check the configured image
      const configuredImage = getChallengeImage(challenge.id);
      console.log(`🔍 [Challenge ${challenge.id}] Got image path: ${configuredImage}`);
      
      try {
        // If the configured image exists, use it
        setImageSrc(configuredImage);
        
        // Determine the tier based on the image path
        if (configuredImage.includes('/lovable-uploads/')) {
          console.log(`🔍 [Challenge ${challenge.id}] Using uploaded image`);
          setImageTier('configured');
        } else if (configuredImage.includes('/challenges/gamma/')) {
          console.log(`🔍 [Challenge ${challenge.id}] Using gamma screenshot`);
          setImageTier('gamma');
        } else if (configuredImage.includes('/challenges/images/')) {
          console.log(`🔍 [Challenge ${challenge.id}] Using custom challenge image`);
          setImageTier('configured');
        } else {
          console.log(`🔍 [Challenge ${challenge.id}] Using default image`);
          setImageTier('default');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error(`❌ [Challenge ${challenge.id}] Error setting up image:`, err);
        setImageSrc(DEFAULT_CHALLENGE_IMAGE);
        setImageTier('default');
        setIsLoading(false);
      }
    };
    
    loadImage();
  }, [challenge.id]);

  const handleImageError = () => {
    console.error(`❌ [Challenge ${challenge.id}] Error loading image. Current tier: ${imageTier}, Path: ${imageSrc}`);
    
    // If we're already at the default tier and it failed, show error state
    if (imageTier === 'default') {
      setImageError(true);
      setImageTier('error');
      return;
    }
    
    // Try the default image as a last resort
    console.log(`🔄 [Challenge ${challenge.id}] Falling back to default image`);
    setImageSrc(DEFAULT_CHALLENGE_IMAGE);
    setImageTier('default');
  };

  return (
    <Card className="overflow-hidden border-bread-100 hover:shadow-md transition-all duration-300">
      <div className={`${isLarge ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col sm:flex-row h-full'}`}>
        <div className={`${isLarge ? 'aspect-video relative' : 'sm:w-1/3 relative'} overflow-hidden bg-bread-50`}>
          <AspectRatio ratio={16/9}>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-bread-100">
                <div className="animate-pulse w-12 h-12 rounded-full bg-bread-200"></div>
              </div>
            ) : !imageError ? (
              <img 
                src={imageSrc}
                alt={challenge.title} 
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-bread-100 p-4">
                <AlertTriangle className="h-12 w-12 text-bread-400 mb-2" />
                <ImageIcon className="h-8 w-8 text-bread-400 mb-2" />
                <div className="text-center">
                  <p className="text-bread-600 text-base font-medium mb-2">{formattedDate}</p>
                  <h4 className="font-serif font-medium text-bread-800 text-lg md:text-xl">{challenge.title}</h4>
                  {challenge.hashtag && (
                    <p className="text-bread-700 font-medium text-base mt-2">{challenge.hashtag}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Image overlay with dark color at the TOP for better text visibility */}
            {!imageError && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-b from-bread-950/90 via-bread-900/60 to-transparent flex flex-col justify-start p-4 text-white">
                <div className="space-y-1">
                  <p className="text-white/90 text-sm md:text-base font-medium">{formattedDate}</p>
                  <h4 className="font-serif font-medium text-xl md:text-2xl text-white">{challenge.title}</h4>
                  {challenge.hashtag && (
                    <p className="text-white/90 font-medium text-sm md:text-base mt-1">#{challenge.hashtag}</p>
                  )}
                </div>
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
                #{challenge.hashtag}
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
