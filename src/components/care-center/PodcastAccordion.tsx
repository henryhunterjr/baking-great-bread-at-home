
import React from 'react';
import { MediaItem } from '@/components/care-center/MediaCard';
import MediaCard from '@/components/care-center/MediaCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface PodcastAccordionProps {
  podcastsBySource: Record<string, MediaItem[]>;
}

const PodcastAccordion: React.FC<PodcastAccordionProps> = ({ podcastsBySource }) => {
  return (
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
  );
};

export default PodcastAccordion;
