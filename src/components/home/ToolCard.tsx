
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  if (compact) {
    return (
      <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 aspect-square md:aspect-auto overflow-hidden">
            <img 
              src={tool.image} 
              alt={tool.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-medium mb-2">{tool.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
            </div>
            <Button 
              size="sm" 
              className="bg-bread-800 hover:bg-bread-900 text-white"
              asChild
            >
              {tool.isExternalLink ? (
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  Shop Now
                  <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              ) : (
                <Link to={tool.link}>
                  Shop Now
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
      <div className="aspect-video overflow-hidden">
        <img 
          src={tool.image} 
          alt={tool.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-medium mb-2">{tool.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
        <Button 
          size="sm" 
          className="w-full bg-bread-800 hover:bg-bread-900 text-white"
          asChild
        >
          {tool.isExternalLink ? (
            <a href={tool.link} target="_blank" rel="noopener noreferrer">
              Shop Now
              <ArrowRight className="ml-2 h-3 w-3" />
            </a>
          ) : (
            <Link to={tool.link}>
              Shop Now
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
