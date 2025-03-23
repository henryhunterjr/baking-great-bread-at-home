
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toolsData } from '@/components/home/toolsData';
import ToolCard from '@/components/home/ToolCard';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';

const Tools = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState(toolsData);
  
  useEffect(() => {
    // Filter tools based on search term
    if (searchTerm.trim() === '') {
      setFilteredTools(toolsData);
    } else {
      const filtered = toolsData.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTools(filtered);
    }
  }, [searchTerm]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-12 pb-6 md:pt-24 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Button asChild variant="ghost" className="mb-2 md:mb-3 -ml-2 h-8 md:h-10">
              <Link to="/">
                <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-base">Back to Home</span>
              </Link>
            </Button>
            
            <h1 className="font-serif text-2xl md:text-3xl lg:text-5xl font-medium mb-1 md:mb-4">Baking Tools</h1>
            <p className="text-sm md:text-base lg:text-xl text-muted-foreground mb-4 md:mb-6 max-w-3xl">
              Free tools, calculators and resources to help you on your baking journey
            </p>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-sm md:text-base"
              />
            </div>
            
            {filteredTools.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No tools found matching your search.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-16">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;
