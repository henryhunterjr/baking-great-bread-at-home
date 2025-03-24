
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <MediaPageHeader 
              title="Care Center"
              description="Videos, podcasts, and resources to help you improve your bread-making skills"
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
