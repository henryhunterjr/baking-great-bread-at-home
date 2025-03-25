
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

export interface Tool {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string;
  isExternalLink: boolean;
  isFeatured?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  compact?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, compact = false }) => {
  if (compact) {
    return (
      <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 overflow-hidden">
            <AspectRatio ratio={1/1} className="w-full h-full">
              <img 
                src={tool.image} 
                alt={tool.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
            </AspectRatio>
          </div>
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-xl font-medium">{tool.title}</h3>
                {tool.isFeatured && <Badge variant="baking">New</Badge>}
              </div>
              <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
            </div>
            <Button 
              size="sm" 
              className="bg-bread-800 hover:bg-bread-900 text-white"
              asChild
            >
              {tool.isExternalLink ? (
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  Explore
                  <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              ) : (
                <Link to={tool.link}>
                  Explore
                  <ArrowRight className="ml-2 h-3 w-3" />
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
      <div className="overflow-hidden">
        <AspectRatio ratio={16/9}>
          <img 
            src={tool.image} 
            alt={tool.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </AspectRatio>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-serif text-xl font-medium">{tool.title}</h3>
          {tool.isFeatured && <Badge variant="baking">New</Badge>}
        </div>
        <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
        <Button 
          size="sm" 
          className="w-full bg-bread-800 hover:bg-bread-900 text-white"
          asChild
        >
          {tool.isExternalLink ? (
            <a href={tool.link} target="_blank" rel="noopener noreferrer">
              Explore
              <ArrowRight className="ml-2 h-3 w-3" />
            </a>
          ) : (
            <Link to={tool.link}>
              Explore
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
