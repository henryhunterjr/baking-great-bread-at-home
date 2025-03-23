
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Archive, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getChallengeImage } from '@/services/blog/imageUtils';

interface Challenge {
  id: string;
  title: string;
  date: Date;
  description: string;
  link: string;
  hashtag?: string;
  isCurrent: boolean;
}

const ChallengesArchive = () => {
  // Group challenges by year
  const challenges: Challenge[] = [
    // 2025 Challenges
    {
      id: 'march-2025',
      title: 'March Baking Challenge',
      date: new Date(2025, 2, 1), // March 2025
      description: 'Explore the rich traditions and techniques of cultural bread-making from around the world.',
      link: 'https://march-baking-challenge-bqivovr.gamma.site/',
      hashtag: '#Cultural',
      isCurrent: true,
    },
    {
      id: 'february-2025',
      title: 'February Baking Challenge',
      date: new Date(2025, 1, 1), // February 2025
      description: 'Create heart-shaped and love-themed breads perfect for sharing with those you care about.',
      link: 'https://february-baking-challeng-2xj44f0.gamma.site/',
      hashtag: '#love',
      isCurrent: false,
    },
    {
      id: 'january-2025',
      title: 'January Baking Challenge',
      date: new Date(2025, 0, 1), // January 2025
      description: 'Start the new year with wholesome, nutritious bread recipes that support your health goals.',
      link: 'https://january-baking-challenge-kzrlq7f.gamma.site/',
      hashtag: '#freshstart',
      isCurrent: false,
    },
    {
      id: 'december-2024',
      title: 'Give Bread Instead Challenge',
      date: new Date(2024, 11, 1), // December 2024
      description: 'Learn to bake beautiful gift-worthy loaves to share with friends and family during the holiday season.',
      link: 'https://give-bread-instead-6vymlyk.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'november-2024',
      title: 'Enrich That Dough Challenge',
      date: new Date(2024, 10, 1), // November 2024
      description: 'Master the art of enriched doughs with butter, eggs, and other delicious additions.',
      link: 'https://enrich-that-dough-bg84znh.gamma.site/httpsenrich-that-dough-bg84znhgammasite',
      hashtag: '#EnrichThatDough',
      isCurrent: false,
    },
    {
      id: 'halloween-2024',
      title: 'Bewitching Breads Halloween Challenge',
      date: new Date(2024, 9, 15), // Mid-October 2024
      description: 'Create spooky, fun, and festive bread ideas perfect for Halloween celebrations and parties.',
      link: 'https://bewitching-breads-hallow-osjjysy.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'october-2024',
      title: 'Basic Bread Baking Challenge',
      date: new Date(2024, 9, 1), // October 2024
      description: 'A beginner-friendly challenge focusing on the fundamentals of bread baking.',
      link: 'https://basic-bread-baking-chall-me5ejmz.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'september-2024',
      title: 'Kick Up Lunch Challenge',
      date: new Date(2024, 8, 1), // September 2024
      description: 'Create exciting sandwiches and lunch items with your homemade bread.',
      link: 'https://kick-up-lunch-challenge-svhfaab.gamma.site/',
      hashtag: '#KICKUPLUNCH',
      isCurrent: false,
    },
    {
      id: 'challah-2024',
      title: 'Challah Challenge',
      date: new Date(2024, 7, 15), // August 15, 2024
      description: 'Master the art of braiding and baking perfect challah bread with this special challenge.',
      link: 'https://challah-challenge-yqmxx0r.gamma.site/',
      isCurrent: false,
    },
    // 2024 Previous Challenges (original data)
    {
      id: 'march-2024',
      title: 'March Baking Challenge',
      date: new Date(2024, 2, 1), // March 2024
      description: 'Our current monthly baking challenge focusing on spring-themed bread creations.',
      link: 'https://march-baking-challenge-bqivovr.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'february-2024',
      title: 'February Baking Challenge',
      date: new Date(2024, 1, 1), // February 2024
      description: 'Explore heart-shaped and themed breads for the month of love.',
      link: 'https://february-baking-challeng-2xj44f0.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'january-2024',
      title: 'January Baking Challenge',
      date: new Date(2024, 0, 1), // January 2024
      description: 'Start the new year with wholesome, nutritious bread recipes that support your health goals.',
      link: 'https://january-baking-challenge-kzrlq7f.gamma.site/',
      isCurrent: false,
    },
    // 2023 Challenges (original data)
    {
      id: 'december-2023',
      title: 'Give Bread Instead Challenge',
      date: new Date(2023, 11, 1), // December 2023
      description: 'Learn to bake beautiful gift-worthy loaves to share with friends and family during the holiday season.',
      link: 'https://give-bread-instead-6vymlyk.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'november-2023',
      title: 'Enrich That Dough Challenge',
      date: new Date(2023, 10, 1), // November 2023
      description: 'Master the art of enriched doughs with butter, eggs, and other delicious additions.',
      link: 'https://enrich-that-dough-bg84znh.gamma.site/httpsenrich-that-dough-bg84znhgammasite',
      isCurrent: false,
    },
    {
      id: 'october-2023',
      title: 'Basic Bread Baking Challenge',
      date: new Date(2023, 9, 1), // October 2023
      description: 'A beginner-friendly challenge focusing on the fundamentals of bread baking.',
      link: 'https://basic-bread-baking-chall-me5ejmz.gamma.site/',
      isCurrent: false,
    },
    {
      id: 'september-2023',
      title: 'Kick Up Lunch Challenge',
      date: new Date(2023, 8, 1), // September 2023
      description: 'Create exciting sandwiches and lunch items with your homemade bread.',
      link: 'https://kick-up-lunch-challenge-svhfaab.gamma.site/',
      isCurrent: false,
    },
  ];

  const groupedChallenges: Record<number, Challenge[]> = {};
  
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
          {currentChallenge && (
            <section className="mb-16">
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8 flex items-center">
                <Calendar className="mr-3 text-bread-800" />
                Current Challenge
              </h2>
              
              <Card className="overflow-hidden border-bread-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={getChallengeImage(currentChallenge.id)} 
                      alt={currentChallenge.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center">
                    <div className="mb-2 text-sm text-bread-800 font-medium">
                      {format(currentChallenge.date, 'MMMM yyyy')}
                    </div>
                    <h3 className="font-serif text-2xl font-medium mb-2">
                      {currentChallenge.title}
                    </h3>
                    {currentChallenge.hashtag && (
                      <div className="text-bread-800 font-medium text-lg mb-3">
                        {currentChallenge.hashtag}
                      </div>
                    )}
                    <p className="text-muted-foreground mb-6">
                      {currentChallenge.description}
                    </p>
                    <Button 
                      className="bg-bread-800 hover:bg-bread-900 text-white w-fit"
                      asChild
                    >
                      <a href={currentChallenge.link} target="_blank" rel="noopener noreferrer">
                        Join This Challenge
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </section>
          )}
          
          {/* Challenge Archive */}
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
                          <Card key={challenge.id} className="overflow-hidden border-bread-100">
                            <div className="flex flex-col sm:flex-row h-full">
                              <div className="sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden">
                                <img 
                                  src={getChallengeImage(challenge.id)} 
                                  alt={challenge.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardContent className="p-4 sm:w-2/3 flex flex-col justify-between">
                                <div>
                                  <div className="mb-1 text-xs text-bread-800 font-medium">
                                    {format(challenge.date, 'MMMM yyyy')}
                                  </div>
                                  <h3 className="font-serif text-lg font-medium mb-2">
                                    {challenge.title}
                                  </h3>
                                  {challenge.hashtag && (
                                    <div className="text-bread-600 text-sm font-medium mb-1">
                                      {challenge.hashtag}
                                    </div>
                                  )}
                                  <p className="text-muted-foreground text-sm">
                                    {challenge.description}
                                  </p>
                                </div>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="mt-4 border-bread-200 text-bread-800 hover:bg-bread-50 w-fit"
                                  asChild
                                >
                                  <a href={challenge.link} target="_blank" rel="noopener noreferrer">
                                    View Challenge
                                    <ExternalLink className="ml-2 h-3 w-3" />
                                  </a>
                                </Button>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChallengesArchive;
