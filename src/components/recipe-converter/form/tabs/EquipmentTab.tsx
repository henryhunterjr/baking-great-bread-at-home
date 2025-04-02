
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, Trash2, Link } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const EquipmentTab: React.FC = () => {
  const { control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipmentNeeded"
  });
  
  const handleAddEquipment = () => {
    append({
      id: uuidv4(),
      name: '',
      affiliateLink: ''
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Equipment</h3>
        <Button
          type="button"
          size="sm"
          onClick={handleAddEquipment}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>
      
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
          <div className="col-span-5">
            <FormField
              control={control}
              name={`equipmentNeeded.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Equipment name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-6">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <FormField
                control={control}
                name={`equipmentNeeded.${index}.affiliateLink`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Affiliate link (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="col-span-1 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
      
      {fields.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No equipment added yet</p>
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={handleAddEquipment}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Equipment
          </Button>
        </div>
      )}
    </div>
  );
};

export default EquipmentTab;
