
import React from 'react';

interface TourOverlayProps {
  onFinish: () => void;
}

const TourOverlay = ({ onFinish }: TourOverlayProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[60]"
      onClick={onFinish}
      aria-hidden="true"
    />
  );
};

export default TourOverlay;
