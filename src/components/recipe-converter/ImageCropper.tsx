import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { logError } from '@/utils/logger';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setImageError(true);
    logError('Failed to load image in ImageCropper', { imageUrl });
  };
  
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
    if (!containerRef.current || !imageRef.current || !imageLoaded || imageError) {
      logError('Cannot save cropped image', { 
        containerExists: !!containerRef.current,
        imageExists: !!imageRef.current,
        imageLoaded,
        imageError
      });
      
      onComplete(imageUrl);
      return;
    }
    
    try {
      const canvas = document.createElement('canvas');
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        logError('Failed to get canvas context');
        onComplete(imageUrl);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      
      const drawX = -imageRef.current.naturalWidth / 2 + (position.x / scale);
      const drawY = -imageRef.current.naturalHeight / 2 + (position.y / scale);
      
      ctx.drawImage(
        imageRef.current,
        drawX,
        drawY,
        imageRef.current.naturalWidth,
        imageRef.current.naturalHeight
      );
      
      ctx.restore();
      
      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      onComplete(croppedImageUrl);
    } catch (error) {
      logError('Error during image cropping', { error });
      onComplete(imageUrl);
    }
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
          {imageError ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Failed to load image</p>
            </div>
          ) : (
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
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
                draggable={false}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          )}
          
          {!imageError && (
            <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-black/40 rounded-md p-2 text-white">
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-white/20 rounded" onClick={handleZoomIn} title="Zoom In">
                  <ZoomIn size={20} />
                </button>
                <button className="p-1 hover:bg-white/20 rounded" onClick={handleZoomOut} title="Zoom Out">
                  <ZoomOut size={20} />
                </button>
                <button className="p-1 hover:bg-white/20 rounded" onClick={handleRotate} title="Rotate">
                  <RotateCw size={20} />
                </button>
              </div>
              <div className="text-sm">
                Drag to position
              </div>
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={!imageLoaded || imageError}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
