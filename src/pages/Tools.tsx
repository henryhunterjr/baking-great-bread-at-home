
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toolsData } from '@/components/home/toolsData';
import ToolCard from '@/components/home/ToolCard';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">Baking Tools</h1>
            <p className="text-xl text-muted-foreground mb-10">
              Free tools, calculators and resources to help you on your baking journey
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
