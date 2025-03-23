
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SettingsTabProps {
  useAI: boolean;
  setUseAI: (useAI: boolean) => void;
  saveHistory: boolean;
  setSaveHistory: (saveHistory: boolean) => void;
  enhanceRecipes: boolean;
  setEnhanceRecipes: (enhanceRecipes: boolean) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  useAI,
  setUseAI,
  saveHistory,
  setSaveHistory,
  enhanceRecipes,
  setEnhanceRecipes
}) => {
  return (
    <div className="flex-1 p-4 space-y-6">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="ai-powered">AI-Powered Features</Label>
            <p className="text-xs text-muted-foreground">
              Use AI for recipe conversion and generation
            </p>
          </div>
          <Switch 
            id="ai-powered" 
            checked={useAI}
            onCheckedChange={setUseAI}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="save-history">Save Chat History</Label>
            <p className="text-xs text-muted-foreground">
              Remember conversations between sessions
            </p>
          </div>
          <Switch 
            id="save-history" 
            checked={saveHistory}
            onCheckedChange={setSaveHistory}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enhance-recipes">Enhance Recipes</Label>
            <p className="text-xs text-muted-foreground">
              Automatically improve recipes with Henry's tips and suggestions
            </p>
          </div>
          <Switch 
            id="enhance-recipes" 
            checked={enhanceRecipes}
            onCheckedChange={setEnhanceRecipes}
          />
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab;
