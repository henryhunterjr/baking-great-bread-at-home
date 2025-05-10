
import React from 'react';

interface TourOverlayProps {
  onFinish: () => void;
}

const TourOverlay = ({ onFinish }: TourOverlayProps) => {
  // Completely disabled - return null instead of rendering an overlay
  return null;
  
  // Original code (disabled):
  // return (
  //   <div 
  //     className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
  //     onClick={onFinish}
  //     aria-hidden="true"
  //     style={{ pointerEvents: 'auto' }}
  //   />
  // );
};

export default TourOverlay;
