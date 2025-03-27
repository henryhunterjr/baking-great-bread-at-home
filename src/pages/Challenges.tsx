
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Challenges: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();

  // Function to handle view past challenges click
  const handleViewPastChallenges = () => {
    navigate('/challenges/past');
  };

  // Current challenge data (sample)
  const currentChallenge = {
    title: "Focaccia Art Challenge",
    description: "Create a beautiful, edible work of art using focaccia bread as your canvas! Decorate with vegetables, herbs, and other ingredients to create a visual masterpiece that tastes as good as it looks.",
    deadline: "June 30, 2023",
    difficulty: "Intermediate",
    duration: "1 day",
    participants: 87,
    image: "https://images.unsplash.com/photo-1586765677067-f8030bd8e303?q=80&w=1470&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Baking Challenges</h1>
            <p className="text-muted-foreground">
              Join our community baking challenges and improve your skills.
            </p>
          </div>
          
          <Button 
            onClick={handleViewPastChallenges}
            variant="outline" 
            className="mt-4 md:mt-0"
          >
            View Past Challenges
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full">
              <div className="aspect-video lg:aspect-auto lg:h-60 overflow-hidden">
                <img 
                  src={currentChallenge.image}
                  alt={currentChallenge.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <CardTitle className="font-serif text-2xl">{currentChallenge.title}</CardTitle>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active Challenge</Badge>
                </div>
                <CardDescription className="text-base">{currentChallenge.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Difficulty</div>
                    <div className="flex items-center text-sm">
                      <Badge variant="outline">{currentChallenge.difficulty}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Time Required</div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {currentChallenge.duration}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Submission Deadline</div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {currentChallenge.deadline}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Current Participants</div>
                    <div className="text-sm">{currentChallenge.participants} bakers</div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full">Join This Challenge</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-serif">How Challenges Work</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Join the Challenge</h3>
                  <p className="text-sm text-muted-foreground">Sign up for the current challenge to participate.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">2. Bake Your Creation</h3>
                  <p className="text-sm text-muted-foreground">Follow the challenge guidelines to create your bread masterpiece.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">3. Submit Your Results</h3>
                  <p className="text-sm text-muted-foreground">Upload photos and details about your baking process and results.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">4. Community Voting</h3>
                  <p className="text-sm text-muted-foreground">Members vote on submissions based on creativity, difficulty, and presentation.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">5. Earn Badges</h3>
                  <p className="text-sm text-muted-foreground">Winners and participants earn badges for their profile.</p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Link to="/faq/challenges">Read Challenge FAQ</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Challenges;
