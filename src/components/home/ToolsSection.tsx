
import React from 'react';
import ToolsList from './ToolsList';
import AffiliateProductsList from './AffiliateProductsList';
import { toolsData, affiliateProductsData } from './toolsData';
import { Separator } from '@/components/ui/separator';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  // Filter for the 6 specific tools mentioned
  const featuredAffiliateIds = [7, 3, 5, 6, 4, 2]; // IDs for the specific tools (sourdough starter, mod kitchen, wire monkey, holland bowl mill, challenger, goldie)
  const featuredAffiliates = affiliateProductsData.filter(product => 
    featuredAffiliateIds.includes(product.id)
  );
  
  // Use fewer tools for improved performance
  const limitedTools = toolsData.slice(0, 6);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#F6F6F7] dark:bg-bread-900/40 opacity-0">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-10 bg-white/80 dark:bg-bread-900/60 p-6 rounded-lg shadow-sm">
          <h2 className="section-title text-center dark:text-white">Baking Tools & Resources</h2>
          <p className="section-subtitle text-center dark:text-gray-300 mb-8">
            Free tools and resources to help you on your baking journey
          </p>
          
          <ToolsList tools={limitedTools} />
        </div>
        
        <div className="mt-20">
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-bread-200 dark:border-bread-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F6F6F7] dark:bg-bread-900/40 px-6 py-2 text-3xl md:text-4xl lg:text-5xl font-serif text-bread-800 dark:text-bread-200">
                Products I Recommend
              </span>
            </div>
          </div>
          
          <p className="text-center text-bread-700 dark:text-bread-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 italic text-white dark:text-white">
            If I don't use it, I don't recommend it. These are the tools in my kitchen—and in my hands every week.
          </p>
          
          <AffiliateProductsList products={featuredAffiliates} />
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
