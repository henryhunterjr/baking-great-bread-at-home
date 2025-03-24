
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import YouTubeCallout from '@/components/care-center/YouTubeCallout';
import MediaTabs from '@/components/care-center/MediaTabs';
import { getFilteredMedia } from '@/components/care-center/MediaData';
import MediaPageHeader from '@/components/care-center/MediaPageHeader';

const CareCenter = () => {
  const { allMedia, videos, podcasts, podcastsBySource } = getFilteredMedia();
  const heroImageUrl = "/lovable-uploads/00a98698-02e8-4406-a65f-702324e03138.png";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <MediaPageHeader 
              title="The Baker's Bench"
              description="Helping you improve your bread baking skills"
              heroImageUrl={heroImageUrl}
            />
            
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
