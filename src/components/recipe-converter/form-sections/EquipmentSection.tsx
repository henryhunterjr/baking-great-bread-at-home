
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors, Control, useFieldArray } from 'react-hook-form';
import { RecipeData } from '@/types/recipeTypes';
import { Plus, Trash2, Link } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface EquipmentSectionProps {
  register: UseFormRegister<RecipeData>;
  control: Control<RecipeData>;
  errors: FieldErrors<RecipeData>;
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({ 
  register, 
  control, 
  errors 
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'equipmentNeeded'
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Equipment</h3>
        <Button 
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddEquipment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>
      
      {fields && fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
          <div className="col-span-5">
            <Input
              {...register(`equipmentNeeded.${index}.name` as const, {
                required: "Equipment name is required"
              })}
              placeholder="Equipment name"
            />
            {errors.equipmentNeeded?.[index]?.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.equipmentNeeded[index]?.name?.message}
              </p>
            )}
          </div>
          
          <div className="col-span-6">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <Input
                {...register(`equipmentNeeded.${index}.affiliateLink` as const)}
                placeholder="Affiliate link (optional)"
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
      
      {(!fields || fields.length === 0) && (
        <div className="text-center py-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No equipment added yet</p>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleAddEquipment}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Equipment
          </Button>
        </div>
      )}
    </div>
  );
};

export default EquipmentSection;
