
import React from 'react';
import ToolsList from './ToolsList';
import AffiliateProductsList from './AffiliateProductsList';
import { toolsData, affiliateProductsData } from './toolsData';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 dark:bg-bread-900/30 opacity-0">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="section-title text-center dark:text-white">Baking Tools & Resources</h2>
        <p className="section-subtitle text-center dark:text-gray-300 mb-12">
          Free tools and resources to help you on your baking journey
        </p>
        
        <ToolsList tools={toolsData} />
        
        <div className="mt-20">
          <AffiliateProductsList products={affiliateProductsData} />
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
