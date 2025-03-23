
import React from 'react';
import { Calendar } from 'lucide-react';
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/types/challengeTypes';

interface CurrentChallengeProps {
  challenge: Challenge;
}

const CurrentChallenge = ({ challenge }: CurrentChallengeProps) => {
  return (
    <section className="mb-16">
      <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8 flex items-center">
        <Calendar className="mr-3 text-bread-800" />
        Current Challenge
      </h2>
      
      <ChallengeCard challenge={challenge} variant="large" />
    </section>
  );
};

export default CurrentChallenge;
