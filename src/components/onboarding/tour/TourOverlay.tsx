
import React from 'react';

interface TourOverlayProps {
  onFinish: () => void;
}

const TourOverlay = ({ onFinish }: TourOverlayProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
      onClick={onFinish}
      aria-hidden="true"
      style={{ pointerEvents: 'auto' }}
    />
  );
};

export default TourOverlay;
