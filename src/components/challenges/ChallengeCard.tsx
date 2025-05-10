
import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import { Challenge } from '@/types/challengeTypes';
import { challengeImages, DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';
import { Badge } from '@/components/ui/badge';

interface ChallengeCardProps {
  challenge: Challenge;
  variant?: 'default' | 'large';
  isNewestYear?: boolean;
}

const ChallengeCard = ({ 
  challenge, 
  variant = 'default',
  isNewestYear = false
}: ChallengeCardProps) => {
  const isLarge = variant === 'large';
  
  // Get challenge image from mapping or use default image
  const imageUrl = challenge.id && challengeImages[challenge.id] 
    ? challengeImages[challenge.id] 
    : DEFAULT_CHALLENGE_IMAGE;
  
  const formattedDate = format(challenge.date, 'MMMM yyyy');
  
  return (
    <div 
      className={`group rounded-lg overflow-hidden border border-bread-200 dark:border-bread-800 
      bg-white dark:bg-bread-900/50 shadow-sm hover:shadow-md transition-all ${
        isLarge ? 'md:grid md:grid-cols-2 gap-6' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${isLarge ? 'aspect-video md:aspect-auto' : 'aspect-video'}`}>
        <img 
          src={imageUrl} 
          alt={challenge.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_CHALLENGE_IMAGE;
          }}
        />
        
        {challenge.hashtag && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-bread-800/80 text-white hover:bg-bread-800 backdrop-blur-sm">
              #{challenge.hashtag}
            </Badge>
          </div>
        )}
        
        {challenge.isCurrent && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-600/90 text-white hover:bg-green-700 backdrop-blur-sm">
              Current Challenge
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="text-bread-700 dark:text-bread-300 text-sm mb-2">
          {formattedDate}
        </div>
        
        <h3 className={`font-serif font-medium text-bread-900 dark:text-white mb-3 ${
          isLarge ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {challenge.title}
        </h3>
        
        {challenge.description && (
          <p className="text-bread-800 dark:text-bread-200 line-clamp-3 mb-4">
            {challenge.description}
          </p>
        )}
        
        {challenge.link && (
          <a 
            href={challenge.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-bread-800 dark:text-bread-300 hover:text-bread-600 dark:hover:text-bread-100 font-medium"
          >
            View Challenge
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
