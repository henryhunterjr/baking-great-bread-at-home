
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { challenges } from '@/data/challengesData';
import { getChallengeImage } from '@/services/blog/imageUtils';

interface ChallengePreviewSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ChallengePreviewSection = ({ sectionRef }: ChallengePreviewSectionProps) => {
  const navigate = useNavigate();
  
  // Get current challenge
  const currentChallenge = challenges.find(challenge => challenge.isCurrent);
  
  // Get challenge image
  const challengeImage = currentChallenge ? getChallengeImage(currentChallenge.id) : '';
  
  if (!currentChallenge) {
    return null;
  }
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-bread-50/30 dark:bg-bread-950/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-10">
            <Calendar className="mr-3 text-bread-800 dark:text-bread-300 h-6 w-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-medium">
              This Month's Baking Challenge
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src={challengeImage}
                alt={currentChallenge.title} 
                className="w-full h-auto object-cover aspect-video"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=85&w=1200&auto=format&fit=crop";
                }}
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="text-bread-700 dark:text-bread-300 font-medium">
                {new Date(currentChallenge.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl font-medium mb-2">
                {currentChallenge.title}
              </h3>
              
              {currentChallenge.hashtag && (
                <div className="text-bread-700 dark:text-bread-300 font-medium text-lg">
                  #{currentChallenge.hashtag}
                </div>
              )}
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentChallenge.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="bg-bread-800 hover:bg-bread-900 text-white"
                  asChild
                >
                  <a href={currentChallenge.link} target="_blank" rel="noopener noreferrer">
                    Join This Challenge
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/challenges')}
                  className="border-bread-200 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-bread-300"
                >
                  View All Challenges
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengePreviewSection;
