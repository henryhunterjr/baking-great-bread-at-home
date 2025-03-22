
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import AIAssistant from './AIAssistant';

const FloatingAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [position, setPosition] = useState({ right: 20, bottom: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Stop pulsing animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseAnimation(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Periodically pulse every 5 minutes to remind users
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => {
        setPulseAnimation(false);
      }, 5000);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
        className={`fixed rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50 bg-bread-800 hover:bg-bread-700 transition-all
          ${pulseAnimation ? 'animate-pulse-glow' : ''}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          right: `${position.right}px`, 
          bottom: `${position.bottom}px`,
          boxShadow: pulseAnimation ? '0 0 15px 5px rgba(229, 168, 95, 0.7)' : '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
        }}
        onClick={() => setIsOpen(true)}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-br from-bread-600 to-bread-900 ${pulseAnimation ? 'animate-gradient-spin' : ''}`}></div>
        </div>
        <Sparkles className="h-7 w-7 text-white z-10" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[800px] h-[600px] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Baking Assistant</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-hidden">
            <AIAssistant />
          </div>
        </DialogContent>
      </Dialog>
      
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 15px 5px rgba(229, 168, 95, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 25px 8px rgba(229, 168, 95, 0.9);
            transform: scale(1.05);
          }
        }
        
        @keyframes gradient-spin {
          0% {
            background-position: 0% 50%;
            transform: rotate(0deg);
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
            transform: rotate(360deg);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .animate-gradient-spin {
          animation: gradient-spin 3s linear infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </>
  );
};

export default FloatingAIButton;
