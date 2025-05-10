
import React from 'react';
import { Challenge } from '@/types/challengeTypes';
import ChallengeCard from './ChallengeCard';
import { Separator } from '@/components/ui/separator';

interface ChallengeArchiveListProps {
  groupedChallenges: Record<number, Challenge[]>;
  years: number[];
}

const ChallengeArchiveList = ({ groupedChallenges, years }: ChallengeArchiveListProps) => {
  // Get current year
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="mt-16 space-y-16">
      {years.map(year => {
        const isCurrentYear = year === currentYear;
        const is2025 = year === 2025;
        const is2024 = year === 2024;
        const challenges = groupedChallenges[year];
        
        return (
          <div key={year} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-bread-800 dark:text-bread-50">
                {year} Challenges
                {isCurrentYear && (
                  <span className="ml-3 text-sm bg-bread-700 text-white dark:bg-bread-600 dark:text-white px-3 py-1 rounded-full">
                    Current
                  </span>
                )}
              </h2>
            </div>
            
            <Separator className="bg-bread-300 dark:bg-bread-700" />
            
            {(is2025 || is2024) ? (
              // Modern grid layout for 2025 and 2024 challenges
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    isNewestYear={true}
                  />
                ))}
              </div>
            ) : (
              // Default layout for other years (though we shouldn't have any now)
              <div className="space-y-6">
                {challenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChallengeArchiveList;
