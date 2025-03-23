
import React from 'react';
import ToolsList from './ToolsList';
import AffiliateProductsList from './AffiliateProductsList';
import { toolsData, affiliateProductsData } from './toolsData';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  const isMobile = useIsMobile();
  
  return (
    <section ref={sectionRef} className="py-10 md:py-16 lg:py-24 bg-[#F6F6F7] dark:bg-bread-900/40 opacity-0">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 md:mb-10 bg-white/80 dark:bg-bread-900/60 p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="section-title text-center dark:text-white text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-6">Baking Tools & Resources</h2>
          <p className="section-subtitle text-center dark:text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
            Free tools and resources to help you on your baking journey
          </p>
          
          <ToolsList tools={toolsData} displayCount={isMobile ? 3 : 6} />
        </div>
        
        <div className="mt-12 md:mt-20">
          <div className="relative mb-10 md:mb-16">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-bread-200 dark:border-bread-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F6F6F7] dark:bg-bread-900/40 px-3 md:px-4 text-lg md:text-xl font-serif text-bread-800 dark:text-bread-200">
                Products I Recommend
              </span>
            </div>
          </div>
          
          <AffiliateProductsList products={affiliateProductsData} />
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
