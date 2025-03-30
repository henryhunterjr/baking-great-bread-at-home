
import React from 'react';
import { Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const KeyboardShortcuts: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the application more efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Navigation Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + H</kbd>
              </div>
              <div>Go to Home page</div>
              
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + R</kbd>
              </div>
              <div>Go to Recipes page</div>
              
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + C</kbd>
              </div>
              <div>Go to Recipe Converter</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Application Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd>
              </div>
              <div>Focus search</div>
              
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              </div>
              <div>Close dialogs/modals</div>
              
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
              </div>
              <div>Navigate through interactive elements</div>
              
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift + Tab</kbd>
              </div>
              <div>Navigate backward</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
