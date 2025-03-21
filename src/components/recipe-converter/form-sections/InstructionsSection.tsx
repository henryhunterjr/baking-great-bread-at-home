
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash } from 'lucide-react';
import { UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '../RecipeForm';

interface InstructionsSectionProps {
  instructionFields: FieldArrayWithId<RecipeFormValues, "instructions", "id">[];
  register: UseFormRegister<RecipeFormValues>;
  appendInstruction: UseFieldArrayAppend<RecipeFormValues, "instructions">;
  removeInstruction: UseFieldArrayRemove;
  errors: Record<string, any>;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructionFields,
  register,
  appendInstruction,
  removeInstruction,
  errors
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium font-serif">Instructions</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendInstruction("")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>
      
      <div className="space-y-3">
        {instructionFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="mt-2.5 bg-muted w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium flex-shrink-0">
              {index + 1}
            </div>
            <Textarea
              {...register(`instructions.${index}`)}
              placeholder="Describe this step..."
              className={`flex-grow ${errors.instructions?.[index] ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeInstruction(index)}
              className="mt-2"
            >
              <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
        {instructionFields.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            No instructions added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructionsSection;
