
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export interface Tool {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string;
  isExternalLink: boolean;
}

interface ToolCardProps {
  tool: Tool;
  compact?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, compact = false }) => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  if (compact) {
    return (
      <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 h-32 sm:h-auto overflow-hidden relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
            )}
            <img 
              src={tool.image} 
              alt={tool.title} 
              className={`w-full h-full object-cover transition-all duration-500 hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={handleImageLoad}
            />
          </div>
          <div className="sm:w-2/3 p-3 sm:p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-medium mb-1">{tool.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{tool.description}</p>
            </div>
            <Button 
              size="sm" 
              className="bg-bread-800 hover:bg-bread-900 text-white text-xs transition-all duration-300 hover:translate-x-1"
              asChild
            >
              {tool.isExternalLink ? (
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <Link to={tool.link} className="flex items-center">
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card transition-all h-full flex flex-col">
      <AspectRatio ratio={16/9} className="overflow-hidden relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}
        <img 
          src={tool.image} 
          alt={tool.title} 
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      </AspectRatio>
      <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2 line-clamp-1">{tool.title}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-3 flex-grow">{tool.description}</p>
        <Button 
          size={isMobile ? "sm" : "default"} 
          className="w-full bg-bread-800 hover:bg-bread-900 text-white text-xs sm:text-sm transition-all duration-300 mt-auto"
          asChild
        >
          {tool.isExternalLink ? (
            <a href={tool.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center group">
              Explore
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <Link to={tool.link} className="flex items-center justify-center group">
              Explore
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;

