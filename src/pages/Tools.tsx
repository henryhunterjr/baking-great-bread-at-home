
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
      
      <main className="flex-grow pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Button asChild variant="ghost" className="mb-3 md:mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-2 md:mb-4">Baking Tools</h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-10 max-w-3xl">
              Free tools, calculators and resources to help you on your baking journey
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
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
