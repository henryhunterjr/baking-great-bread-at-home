
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BreadTip } from '@/contexts/bread-assistant/types';

interface AITipsDisplayProps {
  suggestions: BreadTip[];
  hydration?: number | null;
  fermentationTime?: string | null;
}

const AITipsDisplay: React.FC<AITipsDisplayProps> = ({
  suggestions,
  hydration,
  fermentationTime
}) => {
  if (suggestions.length === 0 && !hydration && !fermentationTime) {
    return null;
  }
  
  return (
    <Card className="border-l-4 border-l-accent">
      <CardHeader>
        <CardTitle>AI Bread Assistant Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((tip, idx) => (
          <div key={idx} className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium">{tip.title}</h4>
            <p className="text-sm mt-1">{tip.description}</p>
          </div>
        ))}
        
        {hydration && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium">Calculated Hydration</h4>
            <p className="text-sm mt-1">
              Your recipe has approximately {hydration}% hydration.
            </p>
          </div>
        )}
        
        {fermentationTime && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium">Suggested Fermentation</h4>
            <p className="text-sm mt-1">{fermentationTime}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITipsDisplay;
