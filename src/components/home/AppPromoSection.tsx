import React from 'react';

interface AppPromoSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const AppPromoSection: React.FC<AppPromoSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0">
      {/* Content remains the same */}
    </section>
  );
};

export default AppPromoSection;
