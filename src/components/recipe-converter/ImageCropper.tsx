
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateClockwise } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onComplete, onCancel }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };
  
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };
  
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    
    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleSave = () => {
    if (!containerRef.current || !imageRef.current) return;
    
    // Create a canvas with the container dimensions
    const canvas = document.createElement('canvas');
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save the context state
    ctx.save();
    
    // Move to the center of the container
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate the canvas
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Scale the canvas
    ctx.scale(scale, scale);
    
    // Draw the image centered, accounting for position
    const drawX = -imageRef.current.naturalWidth / 2 + (position.x / scale);
    const drawY = -imageRef.current.naturalHeight / 2 + (position.y / scale);
    
    ctx.drawImage(
      imageRef.current,
      drawX,
      drawY,
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight
    );
    
    // Restore the context state
    ctx.restore();
    
    // Convert the canvas to a data URL
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Call the onComplete callback with the cropped image URL
    onComplete(croppedImageUrl);
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Image</DialogTitle>
        </DialogHeader>
        
        <div 
          className="overflow-hidden h-60 sm:h-80 md:h-96 relative border rounded-md"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div 
            style={{ 
              position: 'absolute',
              top: '50%', 
              left: '50%', 
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Recipe" 
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`,
                maxWidth: 'none',
                maxHeight: 'none',
              }}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-black/40 rounded-md p-2 text-white">
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-white/20 rounded" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn size={20} />
              </button>
              <button className="p-1 hover:bg-white/20 rounded" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut size={20} />
              </button>
              <button className="p-1 hover:bg-white/20 rounded" onClick={handleRotate} title="Rotate">
                <RotateClockwise size={20} />
              </button>
            </div>
            <div className="text-sm">
              Drag to position
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
