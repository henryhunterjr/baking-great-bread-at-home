
import React from 'react';
import { Archive } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/types/challengeTypes';

interface ChallengeArchiveListProps {
  groupedChallenges: Record<number, Challenge[]>;
  years: number[];
}

const ChallengeArchiveList = ({ groupedChallenges, years }: ChallengeArchiveListProps) => {
  return (
    <section>
      <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8 flex items-center">
        <Archive className="mr-3 text-bread-800" />
        Challenge Archive
      </h2>
      
      <Accordion type="single" collapsible className="w-full space-y-6">
        {years.map((year) => (
          <AccordionItem 
            key={year} 
            value={year.toString()}
            className="border border-bread-100 rounded-lg px-6 py-2"
          >
            <AccordionTrigger className="font-serif text-xl py-4">
              {year} Challenges
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {groupedChallenges[year]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .filter(challenge => !challenge.isCurrent)
                  .map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} variant="small" />
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default ChallengeArchiveList;
