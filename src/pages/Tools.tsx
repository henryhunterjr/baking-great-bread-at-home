
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toolsData } from '@/components/home/toolsData';
import ToolCard from '@/components/home/ToolCard';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Tools = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Button asChild variant="ghost" className="mb-2 md:mb-3 -ml-2">
              <Link to="/">
                <ArrowLeft className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="text-sm md:text-base">Back to Home</span>
              </Link>
            </Button>
            
            <h1 className="font-serif text-2xl md:text-3xl lg:text-5xl font-medium mb-1 md:mb-4">Baking Tools</h1>
            <p className="text-sm md:text-base lg:text-xl text-muted-foreground mb-4 md:mb-10 max-w-3xl">
              Free tools, calculators and resources to help you on your baking journey
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-16">
              {toolsData.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;
