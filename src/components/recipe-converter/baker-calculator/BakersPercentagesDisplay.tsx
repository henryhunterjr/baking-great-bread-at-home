
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BakersPercentages } from './types';

interface BakersPercentagesDisplayProps {
  bakersPercentages: BakersPercentages | null;
  ingredients: string[];
}

const BakersPercentagesDisplay: React.FC<BakersPercentagesDisplayProps> = ({
  bakersPercentages,
  ingredients
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Baker's Percentages</CardTitle>
      </CardHeader>
      <CardContent>
        {bakersPercentages ? (
          <>
            <div className="flex justify-between mb-4 p-3 bg-muted rounded-md">
              <span className="font-medium">Total Flour Weight:</span> 
              <span>{bakersPercentages.totalFlourWeight}g</span>
            </div>
            
            <div className="flex justify-between mb-4 p-3 bg-muted rounded-md">
              <span className="font-medium">Hydration:</span> 
              <span>{bakersPercentages.hydration}%</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Ingredient</th>
                    <th className="text-right py-2">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {bakersPercentages.percentages.map((item, idx) => (
                    <tr key={idx} className="border-b border-muted">
                      <td className="py-2">{item.name}</td>
                      <td className="text-right py-2">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">No flour found in recipe. Add flour to calculate percentages.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BakersPercentagesDisplay;
