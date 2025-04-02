
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';

const InstructionsTab: React.FC = () => {
  const { control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructions"
  });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Instructions</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => append('')}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>
      
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <div className="mt-2 mr-2 flex-shrink-0">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-bread-100 text-bread-800 text-sm font-medium">
              {index + 1}
            </span>
          </div>
          
          <FormField
            control={control}
            name={`instructions.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea 
                    placeholder={`Step ${index + 1}: e.g., Mix the flour and water...`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="mt-2"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      
      {fields.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No instructions added yet</p>
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => append('')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Step
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstructionsTab;
