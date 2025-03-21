
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard, { Tool } from './ToolCard';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  // Featured tools data with updated affiliate links
  const featuredTools: Tool[] = [
    {
      id: 1,
      title: "Sourhouse Starter Kit",
      image: "https://images.unsplash.com/photo-1635321313157-5be9fde3fcbb?q=80&w=1000&auto=format&fit=crop",
      description: "Everything you need to begin your sourdough journey with confidence.",
      link: "https://bit.ly/Sourhouse",
      isExternalLink: true
    },
    {
      id: 2,
      title: "Brød & Taylor Bread Proofer",
      image: "https://images.unsplash.com/photo-1609501676725-7155fb064675?q=80&w=1000&auto=format&fit=crop",
      description: "Create the perfect environment for your dough with precise temperature control.",
      link: "https://breadandtaylor.com/at_id=330823",
      isExternalLink: true
    },
    {
      id: 3,
      title: "Wire Monkey Shop",
      image: "https://images.unsplash.com/photo-1603792907191-89e55f70099a?q=80&w=1000&auto=format&fit=crop",
      description: "Specialized bread baking equipment for the serious artisan baker.",
      link: "https://bit.ly/3QFQek8",
      isExternalLink: true
    },
    {
      id: 4,
      title: "Challenger Breadware",
      image: "https://images.unsplash.com/photo-1574155376612-bfa4ed8aabfd?q=80&w=1000&auto=format&fit=crop",
      description: "Premium cast iron bread baking equipment for perfect crust and crumb.",
      link: "https://challengerbreadware.com/?ref=henryhunterjr",
      isExternalLink: true
    },
    {
      id: 5,
      title: "Holland Bowl Mill",
      image: "https://images.unsplash.com/photo-1590874023110-f82d5e4317a4?q=80&w=1000&auto=format&fit=crop",
      description: "Handcrafted wooden proofing bowls made from sustainable materials.",
      link: "https://hollandbowlmill.com/baking/?wpam_id=10",
      isExternalLink: true
    },
    {
      id: 6,
      title: "Crust & Crumb",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
      description: "Essential tools for artisan bread baking at home.",
      link: "https://bit.ly/CrustandCrumb",
      isExternalLink: true
    },
    {
      id: 7,
      title: "Rosehill Sourdough",
      image: "https://images.unsplash.com/photo-1586444248879-bc604cbd555a?q=80&w=1000&auto=format&fit=crop",
      description: "Authentic sourdough starters and baking accessories.",
      link: "https://rosehillsourdough.com/shop/",
      isExternalLink: true
    },
    {
      id: 8,
      title: "ModKitchn Bread Lame",
      image: "https://images.unsplash.com/photo-1603569283843-5223b2f550ff?q=80&w=1000&auto=format&fit=crop",
      description: "Precision scoring tool for creating beautiful patterns on your artisan loaves.",
      link: "https://bit.ly/4dsbJ3c",
      isExternalLink: true
    },
    {
      id: 9,
      title: "Barlow & Co Woodwork",
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000&auto=format&fit=crop",
      description: "Handcrafted wooden tools and accessories for artisan bakers.",
      link: "https://bit.ly/3Kl6Zm",
      isExternalLink: true
    },
    {
      id: 10,
      title: "King Arthur Baking",
      image: "https://images.unsplash.com/photo-1588116272743-543e522deb8e?q=80&w=1000&auto=format&fit=crop",
      description: "Premium flours and baking ingredients for professional results.",
      link: "https://bit.ly/4dLztcN",
      isExternalLink: true
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-bread-50/50 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Recommended Tools</h2>
          <p className="section-subtitle">
            Quality equipment makes all the difference. Here are my personally tested recommendations to elevate your baking.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredTools.slice(0, 6).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredTools.slice(6).map((tool) => (
            <ToolCard key={tool.id} tool={tool} compact />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="ghost" 
            className="text-bread-800 hover:bg-bread-50"
            asChild
          >
            <Link to="/tools">
              Browse All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
