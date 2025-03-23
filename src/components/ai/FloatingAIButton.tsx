
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles, X } from 'lucide-react';
import AIAssistant from './AIAssistant';
import './floating-button.css';

const FloatingAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ right: 20, bottom: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [useSheet, setUseSheet] = useState(true);

  // Stop pulsing animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHovered) {
        setPulseAnimation(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isHovered]);

  // Periodically pulse every 30 seconds to remind users
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setPulseAnimation(true);
        setTimeout(() => {
          if (!isHovered) {
            setPulseAnimation(false);
          }
        }, 5000);
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Mouse enter/leave handlers for hover glow effect
  const handleMouseEnter = () => {
    setIsHovered(true);
    setPulseAnimation(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Only disable the pulse animation after a smooth transition
    setTimeout(() => {
      if (!isHovered) {
        setPulseAnimation(false);
      }
    }, 1000);
  };

  // Mouse down handler for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.right,
      y: e.clientY - position.bottom
    });
  };

  // Mouse move handler for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate new position (inverted for right/bottom positioning)
        const newRight = viewportWidth - e.clientX - dragOffset.x;
        const newBottom = viewportHeight - e.clientY - dragOffset.y;
        
        // Ensure button stays within viewport bounds
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
        className={`fixed rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-40 bg-bread-800 hover:bg-bread-700 transition-all
          ${pulseAnimation ? 'animate-pulse-glow' : ''}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          right: `${position.right}px`, 
          bottom: `${position.bottom}px`,
          boxShadow: pulseAnimation ? '0 0 15px 5px rgba(229, 168, 95, 0.7)' : '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
          transition: 'box-shadow 0.8s ease-out, background-color 0.3s ease'
        }}
        onClick={() => setIsOpen(true)}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-br from-bread-600 to-bread-900 ${pulseAnimation ? 'animate-gradient-spin' : ''}`}></div>
        </div>
        <Sparkles className="h-7 w-7 text-white z-10" />
      </Button>

      {useSheet ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent 
            side="right" 
            className="w-[85vw] sm:w-[500px] md:w-[600px] lg:w-[800px] p-0 border-l-2 border-bread-600/30"
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
            <div className="h-[calc(100vh-6rem)] overflow-hidden">
              <AIAssistant />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[800px] h-[600px] p-0">
            <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
              <DialogTitle>Baking Assistant</DialogTitle>
              <DialogDescription className="sr-only">
                AI-powered baking assistant to help with recipes and techniques
              </DialogDescription>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)} 
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="h-full overflow-hidden">
              <AIAssistant />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FloatingAIButton;
