
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export const ConversionSettings = () => {
  const [metricUnits, setMetricUnits] = useState(true);
  const [autoCorrect, setAutoCorrect] = useState(true);
  const [detailLevel, setDetailLevel] = useState([2]); // 1-3 scale (basic, standard, detailed)
  const [formatStyle, setFormatStyle] = useState("standard");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="metric-units">Metric Units</Label>
          <p className="text-xs text-muted-foreground">
            Use metric measurements (grams, ml)
          </p>
        </div>
        <Switch 
          id="metric-units" 
          checked={metricUnits}
          onCheckedChange={setMetricUnits}
        />
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="auto-correct">Auto Correct</Label>
          <p className="text-xs text-muted-foreground">
            Fix common errors in recipes
          </p>
        </div>
        <Switch 
          id="auto-correct" 
          checked={autoCorrect}
          onCheckedChange={setAutoCorrect}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="detail-level">Detail Level</Label>
        <Slider 
          id="detail-level"
          min={1} 
          max={3} 
          step={1} 
          value={detailLevel}
          onValueChange={setDetailLevel}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Basic</span>
          <span>Standard</span>
          <span>Detailed</span>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="format-style">Format Style</Label>
        <Select value={formatStyle} onValueChange={setFormatStyle}>
          <SelectTrigger id="format-style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual Home Baker</SelectItem>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Adjusts styling and terminology of the converted recipe
        </p>
      </div>
    </div>
  );
};

export default ConversionSettings;
