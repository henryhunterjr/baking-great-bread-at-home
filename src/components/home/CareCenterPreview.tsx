
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaCard, { MediaItem } from '../care-center/MediaCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface CareCenterPreviewProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const CareCenterPreview: React.FC<CareCenterPreviewProps> = ({ sectionRef }) => {
  const isMobile = useIsMobile();
  
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
    <section 
      ref={sectionRef} 
      className="py-12 md:py-24 opacity-0 bg-bread-100/50 dark:bg-bread-800/40"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto relative">
          {/* Decorative bread wheat icon at the top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bread-800 text-white p-3 rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c-2.5 0-4.5 2-4.5 4.5 0 1.5.7 2.8 1.8 3.7-3.3.7-5.8 3.7-5.8 7.3 0 .8.7 1.5 1.5 1.5h14c.8 0 1.5-.7 1.5-1.5 0-3.6-2.5-6.6-5.8-7.3 1.1-.9 1.8-2.2 1.8-3.7 0-2.5-2-4.5-4.5-4.5z"/>
            </svg>
          </div>
          
          <div className="mt-8 bg-white/80 dark:bg-bread-950/60 rounded-lg shadow-md p-8 mb-10 md:mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">The Care Center</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Videos, podcasts, and conversations to help you on your bread-making journey
            </p>
          </div>
          
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-6 mb-10`}>
            {featuredMedia.map((item, index) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 bg-white/60 hover:bg-bread-50 dark:border-bread-700 dark:text-white dark:bg-bread-900/60 dark:hover:bg-bread-800"
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
