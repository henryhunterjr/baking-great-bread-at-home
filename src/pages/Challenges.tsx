
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, Trophy, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { challenges } from '@/data/challengesData';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getChallengeImage } from '@/services/blog/imageUtils';

const Challenges = () => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get current challenge
  const currentChallenge = challenges.find(challenge => challenge.isCurrent);
  
  // Get challenge image
  const challengeImage = currentChallenge ? getChallengeImage(currentChallenge.id) : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">
              Baking Challenges
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Join our monthly bread baking challenges to improve your skills, try new techniques, and connect 
              with fellow bakers from around the world.
            </p>
          </div>
          
          {/* Current Challenge Showcase */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="flex items-center mb-8">
              <Calendar className="mr-3 text-bread-800 h-6 w-6" />
              <h2 className="font-serif text-2xl md:text-3xl font-medium">
                This Month's Challenge
              </h2>
            </div>
            
            {currentChallenge ? (
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative overflow-hidden bg-bread-50">
                    <AspectRatio ratio={16/9} className="bg-bread-50">
                      <img 
                        src={challengeImage}
                        alt={currentChallenge.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=85&w=1200&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute top-0 left-0 bg-bread-800 text-white px-4 py-2 font-medium">
                        {new Date(currentChallenge.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </AspectRatio>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-medium mb-3">
                        {currentChallenge.title}
                      </h3>
                      {currentChallenge.hashtag && (
                        <div className="text-bread-700 font-medium text-base mb-4">
                          #{currentChallenge.hashtag}
                        </div>
                      )}
                      <p className="text-muted-foreground mb-6">
                        {currentChallenge.description}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-bread-800 hover:bg-bread-900 text-white"
                        asChild
                      >
                        <a href={currentChallenge.link} target="_blank" rel="noopener noreferrer">
                          <Trophy className="mr-2 h-4 w-4" />
                          Join This Challenge
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/challenges')}
                        className="border-bread-200 text-bread-800 hover:bg-bread-50"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        View Past Challenges
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p>No current challenge found. Check back soon!</p>
              </Card>
            )}
          </div>
          
          {/* Benefits Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-center mb-8">
              Why Join Our Challenges?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-bread-100 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-bread-100 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" stroke="#8B5E3C" strokeWidth="1.5"/>
                      <path d="M12 7.5V12L15 15" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-2">Consistent Practice</h3>
                  <p className="text-muted-foreground">Monthly challenges keep you baking regularly, building consistent skills and confidence.</p>
                </div>
              </Card>
              
              <Card className="p-6 border-bread-100 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-bread-100 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 8.5C17 11.8137 14.3137 14.5 11 14.5C7.68629 14.5 5 11.8137 5 8.5C5 5.18629 7.68629 2.5 11 2.5C14.3137 2.5 17 5.18629 17 8.5Z" stroke="#8B5E3C" strokeWidth="1.5"/>
                      <path d="M11 14.5C6.58172 14.5 3 18.0817 3 22.5H19C19 18.0817 15.4183 14.5 11 14.5Z" stroke="#8B5E3C" strokeWidth="1.5"/>
                      <path d="M19 4.5L21 6.5L19 8.5" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-2">Community Connection</h3>
                  <p className="text-muted-foreground">Share your creations, get inspired by others, and become part of our supportive baking community.</p>
                </div>
              </Card>
              
              <Card className="p-6 border-bread-100 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-bread-100 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3.5L14.5 8.5L20 9.5L16 13.5L17 19L12 16.5L7 19L8 13.5L4 9.5L9.5 8.5L12 3.5Z" stroke="#8B5E3C" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-2">Learn New Techniques</h3>
                  <p className="text-muted-foreground">Each challenge introduces new skills, recipes, and techniques to expand your baking repertoire.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Challenges;
