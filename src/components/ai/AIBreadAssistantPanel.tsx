
import React from 'react';
import { X } from 'lucide-react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BreadAssistantPanel from '@/components/recipe-converter/BreadAssistantPanel';

const AIBreadAssistantPanel: React.FC = () => {
  const { isAssistantOpen, toggleAssistant } = useBreadAssistant();
  
  if (!isAssistantOpen) return null;
  
  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96">
      <Card className="shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Bread Assistant</CardTitle>
            <Button variant="ghost" size="sm" onClick={toggleAssistant} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BreadAssistantPanel />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBreadAssistantPanel;
