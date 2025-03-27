
import React from 'react';
import { Play, Headphones, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MediaItem {
  id: string;
  type: 'video' | 'podcast';
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  duration: string;
  date: string;
}

const BakersBenchSection = () => {
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'video',
      title: 'Sourdough Basics: Getting Started',
      description: 'Learn the fundamentals of creating and maintaining your own sourdough starter.',
      thumbnail: 'https://images.unsplash.com/photo-1610874150308-0a9a92d37b66?q=80&w=1000&auto=format&fit=crop',
      link: 'https://youtu.be/example1',
      duration: '18:45',
      date: 'March 15, 2023'
    },
    {
      id: '2',
      type: 'podcast',
      title: 'The History of Bread',
      description: 'Explore the fascinating 10,000-year journey of bread from ancient grains to modern loaves.',
      thumbnail: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1000&auto=format&fit=crop',
      link: 'https://podcast.example/bread-history',
      duration: '42:30',
      date: 'January 22, 2023'
    },
    {
      id: '3',
      type: 'video',
      title: 'Perfect Focaccia Every Time',
      description: 'Master the art of creating delicious, airy focaccia with a crispy, olive oil-infused crust.',
      thumbnail: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1000&auto=format&fit=crop',
      link: 'https://youtu.be/example3',
      duration: '21:15',
      date: 'April 5, 2023'
    },
    {
      id: '4',
      type: 'podcast',
      title: 'Flour Power: Choosing the Right Grains',
      description: 'Learn about different flour types and how they affect your bread\'s texture, flavor, and nutrition.',
      thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
      link: 'https://podcast.example/flour-power',
      duration: '35:45',
      date: 'February 18, 2023'
    }
  ];

  return (
    <section className="py-20 bg-bread-50/30 dark:bg-bread-950/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-3">
                The Baker's Bench
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Watch tutorials, listen to podcasts, and expand your bread-making knowledge.
              </p>
            </div>
            
            <Button 
              variant="outline"
              className="mt-4 md:mt-0 border-bread-200 text-bread-800 hover:bg-bread-50"
            >
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <Card key={item.id} className="overflow-hidden h-full transition-shadow hover:shadow-md">
                <div className="relative aspect-video overflow-hidden bg-bread-100">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="rounded-full bg-white/90 p-3 shadow-lg">
                      {item.type === 'video' ? (
                        <Play className="h-6 w-6 text-bread-800 fill-current" />
                      ) : (
                        <Headphones className="h-6 w-6 text-bread-800" />
                      )}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-bread-700 bg-bread-100 px-2 py-1 rounded-full">
                      {item.type === 'video' ? 'Video' : 'Podcast'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  </div>
                  
                  <h3 className="font-serif font-medium text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  
                  <div className="text-xs text-muted-foreground">
                    {item.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BakersBenchSection;
