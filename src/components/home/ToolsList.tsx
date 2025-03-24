
import React, { memo } from 'react';
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
  
  // Display fewer tools on mobile and desktop for better performance
  const displayTools = isMobile ? tools.slice(0, 2) : tools.slice(0, 3);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-10">
        {displayTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      
      <div className="text-center mb-6 md:mb-10 flex flex-col sm:flex-row justify-center items-center gap-4">
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
        
        <Button 
          asChild
          variant="outline"
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900 transition-all duration-300"
        >
          <Link to="/recipe-converter" className="flex items-center">
            Recipe Converter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ToolsList);
