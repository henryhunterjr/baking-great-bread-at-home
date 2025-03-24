
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const YouTubeCallout: React.FC = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/30 p-6 rounded-lg">
      <div>
        <h2 className="text-xl font-serif mb-2">More Videos on YouTube</h2>
        <p className="text-muted-foreground">Check out my YouTube channel for more bread-making videos and tutorials</p>
      </div>
      <Button 
        variant="outline" 
        size="lg"
        className="border-bread-200 text-bread-800 hover:bg-bread-50"
        asChild
      >
        <a href="https://www.youtube.com/@GreatBreadAtHome" target="_blank" rel="noopener noreferrer">
          Visit YouTube Channel
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

export default YouTubeCallout;
