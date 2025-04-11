import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles, X } from 'lucide-react';
import AIAssistant from './AIAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import './floating-button.css';

const FloatingAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ right: 20, bottom: 90 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Always keep animation on to maintain visibility
    setPulseAnimation(true);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.right,
      y: e.clientY - position.bottom
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const newRight = viewportWidth - e.clientX - dragOffset.x;
        const newBottom = viewportHeight - e.clientY - dragOffset.y;
        
        setPosition({
          right: Math.max(10, Math.min(viewportWidth - 70, newRight)),
          bottom: Math.max(10, Math.min(viewportHeight - 70, newBottom))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      <Button
        className={`fixed rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg z-40 bg-bread-800 hover:bg-bread-700 transition-all
          ${pulseAnimation ? 'animate-pulse-glow' : ''}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          right: `${position.right}px`, 
          bottom: `${position.bottom}px`,
          boxShadow: '0 0 15px 5px rgba(229, 168, 95, 0.7)',
          transition: 'background-color 0.3s ease'
        }}
        onClick={() => setIsOpen(true)}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Open AI Baking Assistant"
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-bread-600 to-bread-900 animate-gradient-spin"></div>
        </div>
        <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-white z-10" />
      </Button>

      {isMobile !== null && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent 
            side={isMobile ? "bottom" : "right"}
            className={`
              ${isMobile ? 'h-[90vh] rounded-t-xl' : 'w-[85vw] sm:w-[500px] md:w-[600px] lg:w-[800px]'} 
              p-0 border-l-2 border-bread-600/30
            `}
          >
            <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
              <SheetTitle>Baking Assistant</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)} 
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetHeader>
            <div className={`${isMobile ? 'h-[calc(90vh-5rem)]' : 'h-[calc(100vh-6rem)]'} overflow-hidden`}>
              <AIAssistant />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default FloatingAIButton;
