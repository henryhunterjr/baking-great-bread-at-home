
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import MediaCard, { MediaItem } from '@/components/care-center/MediaCard';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const CareCenter = () => {
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'My Foolproof Sourdough Recipe: Start to Finish',
      url: 'https://youtu.be/ubJWmOAN684',
      type: 'video',
      source: 'YouTube',
      description: 'A comprehensive guide to making the perfect sourdough bread from start to finish'
    },
    {
      id: '2',
      title: 'Breaking Bread Podcast: Sourdough for the Rest of Us',
      url: 'https://youtu.be/FiQg8AaW7PE',
      description: 'Discussion about Henry\'s latest book "Sourdough for the Rest of Us"',
      type: 'podcast',
      source: 'Breaking Bread'
    },
    {
      id: '3',
      title: 'Henry Hunter on Life, the Universe, and Bread',
      url: 'https://youtu.be/49XtxfMlBgo',
      type: 'podcast',
      source: 'The Jar Podcast',
      description: 'A deep conversation about the philosophy of bread-making'
    },
    {
      id: '4',
      title: 'Henry Hunter on Bitterness and Mental Health',
      url: 'https://youtu.be/4BbpFdwUmM0',
      type: 'podcast',
      source: 'The Jar Podcast',
      description: 'A personal discussion about mental health in the baking industry'
    },
    {
      id: '5',
      title: 'Breaking Bread Podcast: Vitally Sourdough Mastery',
      url: 'https://youtu.be/VhyS_O5HAd0',
      type: 'podcast',
      source: 'Breaking Bread',
      description: 'Exploring the techniques and philosophy in Henry\'s book "Vitally Sourdough Mastery"'
    },
    {
      id: '6',
      title: 'Henry Hunter on Life, Bread, and the Universe - Part 2',
      url: 'https://youtu.be/49XtxfMlBgo',
      type: 'podcast',
      source: 'The Jar Podcast',
      description: 'Continuing the deep conversation about bread-making philosophy'
    }
  ];

  const videos = mediaItems.filter(item => item.type === 'video');
  const podcasts = mediaItems.filter(item => item.type === 'podcast');
  
  // Group podcasts by source
  const podcastsBySource = podcasts.reduce((acc, podcast) => {
    if (!acc[podcast.source]) {
      acc[podcast.source] = [];
    }
    acc[podcast.source].push(podcast);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">Care Center</h1>
            <p className="text-xl text-muted-foreground mb-10">
              Videos, podcasts, and resources to help you improve your bread-making skills
            </p>
            
            <Separator className="mb-10" />
            
            <Tabs defaultValue="all" className="mb-10">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaItems.map(item => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(video => (
                    <MediaCard key={video.id} item={video} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="podcasts">
                <Accordion type="single" collapsible className="mb-6">
                  {Object.entries(podcastsBySource).map(([source, podcasts]) => (
                    <AccordionItem key={source} value={source}>
                      <AccordionTrigger className="text-xl font-serif">{source}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                          {podcasts.map(podcast => (
                            <MediaCard key={podcast.id} item={podcast} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {podcasts.map(podcast => (
                    <MediaCard key={podcast.id} item={podcast} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareCenter;
