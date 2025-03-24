
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import YouTubeCallout from '@/components/care-center/YouTubeCallout';
import MediaTabs from '@/components/care-center/MediaTabs';
import { getFilteredMedia } from '@/components/care-center/MediaData';

const CareCenter = () => {
  const { allMedia, videos, podcasts, podcastsBySource } = getFilteredMedia();

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
            
            <YouTubeCallout />
            
            <Separator className="mb-10" />
            
            <MediaTabs 
              mediaItems={allMedia}
              videos={videos}
              podcasts={podcasts}
              podcastsBySource={podcastsBySource}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareCenter;
