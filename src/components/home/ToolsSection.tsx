import React from 'react';

interface ToolsSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 opacity-0">
      {/* Content remains the same */}
    </section>
  );
};

export default ToolsSection;
