
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

// Sample past challenges data
const pastChallenges = [
  {
    id: 1,
    title: 'Perfect Sourdough',
    description: 'Master the art of creating the perfect sourdough bread with a crispy crust and airy crumb.',
    date: 'March 2023',
    participants: 245,
    difficulty: 'Intermediate',
    duration: '3 days',
    image: 'https://images.unsplash.com/photo-1585478259715-4dbd899fdf86?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Holiday Breads',
    description: 'Create traditional holiday breads from around the world, from Italian Panettone to German Stollen.',
    date: 'December 2022',
    participants: 312,
    difficulty: 'Advanced',
    duration: '1 week',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Artisan Rolls',
    description: 'Bake a variety of artisan dinner rolls perfect for any meal.',
    date: 'October 2022',
    participants: 187,
    difficulty: 'Beginner',
    duration: '1 day',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Gluten-Free Baking',
    description: 'Learn techniques for baking delicious gluten-free bread alternatives.',
    date: 'August 2022',
    participants: 203,
    difficulty: 'Intermediate',
    duration: '2 days',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=400&auto=format&fit=crop'
  }
];

const PastChallenges: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        <h1 className="text-3xl font-serif font-bold mb-2">Past Baking Challenges</h1>
        <p className="text-muted-foreground mb-8">
          Browse our previous baking challenges and get inspired for your next baking adventure.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-serif">{challenge.title}</CardTitle>
                  <Badge variant="outline">{challenge.difficulty}</Badge>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {challenge.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {challenge.participants} participants
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {challenge.duration}
                </div>
              </CardContent>
              
              <CardFooter>
                <a 
                  href={`/challenges/${challenge.id}`} 
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  View Challenge Details
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PastChallenges;
