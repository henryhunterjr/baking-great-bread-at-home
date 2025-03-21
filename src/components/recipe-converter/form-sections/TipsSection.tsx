
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { RecipeFormValues } from '../RecipeForm';

interface TipsSectionProps {
  register: UseFormRegister<RecipeFormValues>;
  control: Control<RecipeFormValues>;
}

const TipsSection: React.FC<TipsSectionProps> = ({
  register,
  control
}) => {
  // Properly type each useFieldArray with their correct field names
  const { fields: tipFields, append: appendTip, remove: removeTip } = useFieldArray<RecipeFormValues>({
    control,
    name: "tips" as const
  });
  
  const { fields: proTipFields, append: appendProTip, remove: removeProTip } = useFieldArray<RecipeFormValues>({
    control,
    name: "proTips" as const
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium font-serif">Tips</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTip("" as any)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tip
          </Button>
        </div>
        
        <div className="space-y-3">
          {tipFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...register(`tips.${index}`)}
                placeholder="Helpful tip..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTip(index)}
              >
                <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
          {tipFields.length === 0 && (
            <p className="text-sm italic text-muted-foreground">
              No tips added yet
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium font-serif">Pro Tips</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendProTip("" as any)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Pro Tip
          </Button>
        </div>
        
        <div className="space-y-3">
          {proTipFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...register(`proTips.${index}`)}
                placeholder="Advanced technique..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProTip(index)}
              >
                <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
          {proTipFields.length === 0 && (
            <p className="text-sm italic text-muted-foreground">
              No pro tips added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
