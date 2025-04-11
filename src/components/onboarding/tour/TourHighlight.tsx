
import React from 'react';

interface TourHighlightProps {
  targetElement: Element | null;
}

const TourHighlight = ({ targetElement }: TourHighlightProps) => {
  if (!targetElement) return null;
  
  return (
    <div
      className="fixed z-[70] rounded-lg ring-4 ring-primary animate-pulse pointer-events-none"
      style={{
        top: targetElement.getBoundingClientRect().top,
        left: targetElement.getBoundingClientRect().left,
        width: targetElement.getBoundingClientRect().width,
        height: targetElement.getBoundingClientRect().height,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
      }}
    />
  );
};

export default TourHighlight;
