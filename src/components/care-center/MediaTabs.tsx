
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaItem } from '@/components/care-center/MediaCard';
import MediaList from '@/components/care-center/MediaList';
import PodcastAccordion from '@/components/care-center/PodcastAccordion';

interface MediaTabsProps {
  mediaItems: MediaItem[];
  videos: MediaItem[];
  podcasts: MediaItem[];
  podcastsBySource: Record<string, MediaItem[]>;
}

const MediaTabs: React.FC<MediaTabsProps> = ({ 
  mediaItems, 
  videos, 
  podcasts, 
  podcastsBySource 
}) => {
  return (
    <Tabs defaultValue="all" className="mb-10">
      <TabsList className="mb-8">
        <TabsTrigger value="all">All Resources</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <MediaList items={mediaItems} />
      </TabsContent>
      
      <TabsContent value="videos">
        <MediaList items={videos} />
      </TabsContent>
      
      <TabsContent value="podcasts">
        <PodcastAccordion podcastsBySource={podcastsBySource} />
        
        <MediaList items={podcasts} />
      </TabsContent>
    </Tabs>
  );
};

export default MediaTabs;
