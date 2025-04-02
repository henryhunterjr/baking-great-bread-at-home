
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const NotesTab: React.FC = () => {
  const { control } = useFormContext();
  
  const { fields: tips, append: appendTip, remove: removeTip } = useFieldArray({
    control,
    name: "tips"
  });
  
  const { fields: proTips, append: appendProTip, remove: removeProTip } = useFieldArray({
    control,
    name: "proTips"
  });
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Tips</h3>
          <Button
            type="button"
            size="sm"
            onClick={() => appendTip('')}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tip
          </Button>
        </div>
        
        {tips.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2 mb-3">
            <FormField
              control={control}
              name={`tips.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., For a better crust, add steam to your oven..."
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
              onClick={() => removeTip(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        
        {tips.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No tips added yet</p>
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => appendTip('')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Tip
            </Button>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Pro Tips</h3>
          <Button
            type="button"
            size="sm"
            onClick={() => appendProTip('')}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pro Tip
          </Button>
        </div>
        
        {proTips.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2 mb-3">
            <FormField
              control={control}
              name={`proTips.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Professional bakers often use a banneton basket..."
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
              onClick={() => removeProTip(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        
        {proTips.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No pro tips added yet</p>
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => appendProTip('')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Pro Tip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesTab;
