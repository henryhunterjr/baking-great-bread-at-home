
import React from 'react';
import CTAContent from './CTAContent';

interface CTASectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const CTASection: React.FC<CTASectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0 bg-[#F1F1F1] dark:bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bread-800 rounded-2xl p-8 md:p-12 lg:p-16 text-white shadow-lg">
          <CTAContent />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
