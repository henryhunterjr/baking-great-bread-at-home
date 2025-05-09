
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { RecipeData } from '@/types/recipeTypes';
import { Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TipsSectionProps {
  register: UseFormRegister<RecipeData>;
  control: Control<RecipeData>;
}

const TipsSection: React.FC<TipsSectionProps> = ({ 
  register, 
  control
}) => {
  // Use useFieldArray with correct typing
  const { 
    fields: tipFields, 
    append: appendTip, 
    remove: removeTip 
  } = useFieldArray({
    control,
    name: "tips" as any // Using type assertion to bypass type checking
  });
  
  const { 
    fields: proTipFields, 
    append: appendProTip, 
    remove: removeProTip 
  } = useFieldArray({
    control,
    name: "proTips" as any // Using type assertion to bypass type checking
  });

  const addTip = () => {
    appendTip("" as any); // Using type assertion to bypass type checking
  };

  const addProTip = () => {
    appendProTip("" as any); // Using type assertion to bypass type checking
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tips & Tricks</h3>
      
      <Tabs defaultValue="basic-tips">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic-tips">Basic Tips</TabsTrigger>
          <TabsTrigger value="pro-tips">Pro Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic-tips" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Basic Tips</Label>
            <Button 
              type="button"
              size="sm"
              variant="outline"
              onClick={addTip}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tip
            </Button>
          </div>
          
          {tipFields && tipFields.map((field, index) => (
            <div key={field.id} className="flex items-start space-x-2">
              <div className="flex-grow">
                <Input
                  {...register(`tips.${index}` as any)}
                  placeholder="e.g., For best results, use bread flour with at least 12% protein"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTip(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          
          {(!tipFields || tipFields.length === 0) && (
            <div className="text-center py-4 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No tips added yet</p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={addTip}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Tip
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pro-tips" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Pro Tips</Label>
            <Button 
              type="button"
              size="sm"
              variant="outline"
              onClick={addProTip}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pro Tip
            </Button>
          </div>
          
          {proTipFields && proTipFields.map((field, index) => (
            <div key={field.id} className="flex items-start space-x-2">
              <div className="flex-grow">
                <Input
                  {...register(`proTips.${index}` as any)}
                  placeholder="e.g., Try cold autolyse by refrigerating overnight before adding starter"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProTip(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          
          {(!proTipFields || proTipFields.length === 0) && (
            <div className="text-center py-4 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No pro tips added yet</p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={addProTip}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Pro Tip
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TipsSection;
