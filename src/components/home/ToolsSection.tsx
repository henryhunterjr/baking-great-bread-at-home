
import React from 'react';
import ToolsList from './ToolsList';
import AffiliateProductsList from './AffiliateProductsList';
import { toolsData, affiliateProductsData } from './toolsData';
import { Separator } from '@/components/ui/separator';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  // Use fewer products for improved performance
  const limitedAffiliateProducts = affiliateProductsData.slice(0, 3);
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
              <span className="bg-[#F6F6F7] dark:bg-bread-900/40 px-4 text-xl font-serif text-bread-800 dark:text-bread-200">
                Products I Recommend
              </span>
            </div>
          </div>
          
          <AffiliateProductsList products={limitedAffiliateProducts} />
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
