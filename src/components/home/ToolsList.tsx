
import React, { useEffect, useRef } from 'react';
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
  const listRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Apply staggered animation to tool cards
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '20px' }
    );

    const cards = listRef.current?.querySelectorAll('.tool-card-container') || [];
    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, [tools]);

  return (
    <>
      <div 
        ref={listRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-10"
      >
        {tools.slice(0, displayCount).map((tool, index) => (
          <div key={tool.id} className="tool-card-container h-full">
            <ToolCard tool={tool} animationDelay={index * 100} />
          </div>
        ))}
      </div>
      
      <div className="text-center mb-4 md:mb-8 lg:mb-16">
        <Button 
          asChild
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900 text-xs sm:text-sm hover-scale transition-all duration-300 group"
        >
          <Link to="/tools" className="flex items-center">
            View All Tools
            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ToolsList;
