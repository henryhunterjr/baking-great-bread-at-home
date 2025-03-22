
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface CameraInputTabProps {
  onCameraPicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraInputTab: React.FC<CameraInputTabProps> = ({ onCameraPicture }) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Camera className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Take a Photo</h3>
        <p className="text-muted-foreground mb-4">
          Use your camera to take a photo of your recipe
        </p>
        <Input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onCameraPicture}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
        >
          Open Camera
        </Button>
      </div>
    </div>
  );
};

export default CameraInputTab;
