
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import DevConsole from './DevConsole';
import { isDevelopmentEnvironment } from '@/utils/devErrorHandler';

const DevToolsToggle: React.FC = () => {
  const [showConsole, setShowConsole] = useState(false);
  
  // Only show in development environment
  if (!isDevelopmentEnvironment()) return null;
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary/20"
        onClick={() => setShowConsole(!showConsole)}
      >
        <Bug className="h-4 w-4" />
      </Button>
      
      {showConsole && <DevConsole onClose={() => setShowConsole(false)} />}
    </>
  );
};

export default DevToolsToggle;
