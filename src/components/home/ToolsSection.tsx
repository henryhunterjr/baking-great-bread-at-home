
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard, { Tool } from './ToolCard';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  const tools: Tool[] = [
    {
      id: 1,
      title: "From Card to Kitchen",
      image: "https://images.unsplash.com/photo-1556911261-6bd341186b2f?q=80&w=1000&auto=format&fit=crop",
      description: "Convert old family recipes, scanned images, or digital clippings into clean, standardized recipe cards.",
      link: "/recipe-converter",
      isExternalLink: false
    },
    {
      id: 2,
      title: "Sourdough Calculator",
      image: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=1000&auto=format&fit=crop",
      description: "Calculate hydration, starter percentages, and timings for the perfect sourdough loaf.",
      link: "/tools",
      isExternalLink: false
    },
    {
      id: 3,
      title: "Flavor Pairing Guide",
      image: "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?q=80&w=1000&auto=format&fit=crop",
      description: "Discover unexpected flavor combinations that will elevate your breads and pastries.",
      link: "/tools",
      isExternalLink: false
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 opacity-0">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="section-title text-center">Baking Tools & Resources</h2>
        <p className="section-subtitle text-center">
          Free tools and resources to help you on your baking journey
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            asChild
            variant="outline"
            className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white"
          >
            <Link to="/tools">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
