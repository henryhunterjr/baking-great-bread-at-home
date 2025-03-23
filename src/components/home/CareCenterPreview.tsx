
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaCard, { MediaItem } from '../care-center/MediaCard';

interface CareCenterPreviewProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const CareCenterPreview: React.FC<CareCenterPreviewProps> = ({ sectionRef }) => {
  // Featured media items for the homepage preview
  const featuredMedia: MediaItem[] = [
    {
      id: '7',
      title: 'Bread at Halloween: Spooky Loaves and Traditions',
      url: 'https://youtu.be/QXGqj6Uaa2M?si=E1pDiPdEo4gJB9UF',
      type: 'video',
      source: 'YouTube',
      description: 'Explore the fascinating history and techniques behind Halloween-themed bread making traditions'
    },
    {
      id: '1',
      title: 'My Foolproof Sourdough Recipe: Start to Finish',
      url: 'https://youtu.be/ubJWmOAN684',
      type: 'video',
      source: 'YouTube'
    },
    {
      id: '2',
      title: 'Breaking Bread Podcast: Sourdough for the Rest of Us',
      url: 'https://youtu.be/FiQg8AaW7PE',
      description: 'Discussion about Henry\'s latest book "Sourdough for the Rest of Us"',
      type: 'podcast',
      source: 'Breaking Bread'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 md:mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">The Care Center</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Videos, podcasts, and conversations to help you on your bread-making journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {featuredMedia.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 hover:bg-bread-50"
              asChild
            >
              <Link to="/care-center">
                View All Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareCenterPreview;
