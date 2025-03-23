
import React from 'react';
import { Challenge } from '@/types/challengeTypes';
import ChallengeCard from './ChallengeCard';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface ChallengeArchiveListProps {
  groupedChallenges: Record<number, Challenge[]>;
  years: number[];
}

const ChallengeArchiveList = ({ groupedChallenges, years }: ChallengeArchiveListProps) => {
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Check if 2025 exists in our years array
  const has2025 = years.includes(2025);
  
  return (
    <div className="mt-16 space-y-16">
      {years.map(year => {
        const isCurrentYear = year === currentYear;
        const is2025 = year === 2025;
        const challenges = groupedChallenges[year];
        
        return (
          <div key={year} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-bread-800">
                {year} Challenges
                {isCurrentYear && (
                  <span className="ml-3 text-sm bg-bread-100 text-bread-800 px-3 py-1 rounded-full">
                    Current
                  </span>
                )}
              </h2>
              
              {/* Optional: Add a toggle button here */}
            </div>
            
            <Separator className="bg-bread-100" />
            
            {is2025 ? (
              // Special layout for 2025 challenges
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
              // Default layout for other years
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
