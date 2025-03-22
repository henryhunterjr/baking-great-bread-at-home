
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard, { Tool } from './ToolCard';

interface ToolsListProps {
  tools: Tool[];
  displayCount?: number;
}

const ToolsList: React.FC<ToolsListProps> = ({ tools, displayCount = 6 }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {tools.slice(0, displayCount).map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      
      <div className="text-center mb-16">
        <Button 
          asChild
          variant="outline"
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900"
        >
          <Link to="/tools">
            View All Tools
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ToolsList;
