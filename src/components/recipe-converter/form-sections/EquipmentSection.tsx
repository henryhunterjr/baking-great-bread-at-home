
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { RecipeFormValues } from '../RecipeForm';

interface EquipmentSectionProps {
  register: UseFormRegister<RecipeFormValues>;
  control: Control<RecipeFormValues>;
  errors: Record<string, any>;
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  register,
  control,
  errors
}) => {
  const { fields: equipmentFields, append, remove } = useFieldArray({
    control,
    name: "equipmentNeeded"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium font-serif">Equipment Needed</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", affiliateLink: "" })}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Equipment
        </Button>
      </div>
      
      <div className="space-y-3">
        {equipmentFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-5 gap-2">
            <Input
              {...register(`equipmentNeeded.${index}.name`)}
              placeholder="Equipment name"
              className={`col-span-2 ${errors.equipmentNeeded?.[index]?.name ? "border-destructive" : ""}`}
            />
            <Input
              {...register(`equipmentNeeded.${index}.affiliateLink`)}
              placeholder="Link to product (optional)"
              className="col-span-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="justify-self-end"
            >
              <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
        {equipmentFields.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            No equipment added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default EquipmentSection;
