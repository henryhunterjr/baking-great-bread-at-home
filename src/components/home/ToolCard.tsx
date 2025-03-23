
import React from 'react';
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
  
  if (compact) {
    return (
      <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 h-32 sm:h-auto overflow-hidden">
            <img 
              src={tool.image} 
              alt={tool.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div className="sm:w-2/3 p-3 sm:p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-medium mb-1">{tool.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{tool.description}</p>
            </div>
            <Button 
              size="sm" 
              className="bg-bread-800 hover:bg-bread-900 text-white text-xs"
              asChild
            >
              {tool.isExternalLink ? (
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              ) : (
                <Link to={tool.link}>
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card">
      <AspectRatio ratio={16/9} className="overflow-hidden">
        <img 
          src={tool.image} 
          alt={tool.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
      </AspectRatio>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2">{tool.title}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-3">{tool.description}</p>
        <Button 
          size={isMobile ? "sm" : "default"} 
          className="w-full bg-bread-800 hover:bg-bread-900 text-white text-xs sm:text-sm"
          asChild
        >
          {tool.isExternalLink ? (
            <a href={tool.link} target="_blank" rel="noopener noreferrer">
              Explore
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          ) : (
            <Link to={tool.link}>
              Explore
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
