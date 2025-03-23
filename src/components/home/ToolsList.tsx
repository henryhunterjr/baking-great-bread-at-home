
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-10">
        {tools.slice(0, displayCount).map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      
      <div className="text-center mb-4 md:mb-8 lg:mb-16">
        <Button 
          asChild
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900 text-xs sm:text-sm"
        >
          <Link to="/tools">
            View All Tools
            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ToolsList;
