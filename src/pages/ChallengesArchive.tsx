
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CurrentChallenge from '@/components/challenges/CurrentChallenge';
import ChallengeArchiveList from '@/components/challenges/ChallengeArchiveList';
import { challenges } from '@/data/challengesData';

const ChallengesArchive = () => {
  // Group challenges by year
  const groupedChallenges: Record<number, typeof challenges> = {};
  
  challenges.forEach(challenge => {
    const year = challenge.date.getFullYear();
    if (!groupedChallenges[year]) {
      groupedChallenges[year] = [];
    }
    groupedChallenges[year].push(challenge);
  });

  // Sort years in descending order
  const years = Object.keys(groupedChallenges)
    .map(Number)
    .sort((a, b) => b - a);

  // Get current challenge
  const currentChallenge = challenges.find(challenge => challenge.isCurrent);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">
              Baking Challenges
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Join our monthly bread baking challenges to improve your skills, try new techniques, and connect 
              with fellow bakers. Browse our archive of past challenges for timeless recipes and inspiration.
            </p>
          </div>
          
          {/* Current Challenge */}
          {currentChallenge && <CurrentChallenge challenge={currentChallenge} />}
          
          {/* Challenge Archive */}
          <ChallengeArchiveList groupedChallenges={groupedChallenges} years={years} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChallengesArchive;
