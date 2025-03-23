
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard, { Tool } from './ToolCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface ToolsListProps {
  tools: Tool[];
  displayCount?: number;
}

const ToolsList: React.FC<ToolsListProps> = ({ tools, displayCount = 6 }) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-10">
        {tools.slice(0, isMobile ? 3 : displayCount).map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      
      <div className="text-center mb-6 md:mb-10">
        <Button 
          asChild
          variant="outline"
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900 transition-all duration-300"
        >
          <Link to="/tools" className="flex items-center">
            View All Tools
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ToolsList;
