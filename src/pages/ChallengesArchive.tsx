
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CurrentChallenge from '@/components/challenges/CurrentChallenge';
import ChallengeArchiveList from '@/components/challenges/ChallengeArchiveList';
import { challenges } from '@/data/challengesData';

const ChallengesArchive = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Log information about the new image configuration approach
  useEffect(() => {
    console.info(`
      Challenge Images Configuration:
      ------------------------------
      Images are now managed through a central configuration file:
      - src/data/challengeImages.ts
      
      To add or update challenge images, simply edit the challengeImages object
      in this file with the mapping from challenge ID to image path.
      
      Example:
      {
        "march-2025": "/lovable-uploads/image-file-name.png",
        "february-2025": "/challenges/images/custom-name-whatever-you-want.png"
      }
      
      The fallback order is:
      1. Configured image from challengeImages.ts
      2. Gamma screenshot at /challenges/gamma/{challenge-id}-screenshot.jpg
      3. Default image (Unsplash bread image)
      
      NOTE: For custom uploads, use the Lovable Chat to upload images and use
      the returned path in the challengeImages.ts file.
      
      For manual uploads, create these directories:
      /public/challenges/images/ - for your custom challenge images
      /public/challenges/gamma/ - for gamma screenshots
    `);
  }, []);

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
          <div className="text-center mb-16 bg-bread-800/90 dark:bg-bread-900 p-8 rounded-lg shadow-md">
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-white">
              Baking Challenges
            </h1>
            <p className="text-bread-100 text-lg max-w-3xl mx-auto">
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
