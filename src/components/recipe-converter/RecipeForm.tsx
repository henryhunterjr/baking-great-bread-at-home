
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  X, 
  Plus, 
  Trash,
  Clock,
  Image
} from 'lucide-react';
import { RecipeData } from '@/pages/RecipeConverter';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface RecipeFormProps {
  initialRecipe: RecipeData;
  onSave: (recipe: RecipeData) => void;
  onCancel: () => void;
}

// Zod schema for form validation
const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  introduction: z.string().optional(),
  ingredients: z.array(z.string().min(1, "Ingredient text is required")),
  prepTime: z.string().optional(),
  restTime: z.string().optional(),
  bakeTime: z.string().optional(),
  totalTime: z.string().optional(),
  instructions: z.array(z.string().min(1, "Instruction text is required")),
  tips: z.array(z.string().optional()),
  proTips: z.array(z.string().optional()),
  equipmentNeeded: z.array(
    z.object({
      name: z.string().min(1, "Equipment name is required"),
      affiliateLink: z.string().optional()
    })
  ),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
  isPublic: z.boolean().default(false),
  isConverted: z.boolean().default(true)
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

const RecipeForm: React.FC<RecipeFormProps> = ({ 
  initialRecipe, 
  onSave, 
  onCancel 
}) => {
  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialRecipe
  });
  
  const { 
    fields: ingredientFields, 
    append: appendIngredient, 
    remove: removeIngredient 
  } = useFieldArray({ control, name: "ingredients" });
  
  const { 
    fields: instructionFields, 
    append: appendInstruction, 
    remove: removeInstruction 
  } = useFieldArray({ control, name: "instructions" });
  
  const { 
    fields: tipFields, 
    append: appendTip, 
    remove: removeTip 
  } = useFieldArray({ control, name: "tips" });
  
  const { 
    fields: proTipFields, 
    append: appendProTip, 
    remove: removeProTip 
  } = useFieldArray({ control, name: "proTips" });
  
  const { 
    fields: equipmentFields, 
    append: appendEquipment, 
    remove: removeEquipment 
  } = useFieldArray({ control, name: "equipmentNeeded" });
  
  const { 
    fields: tagFields,
    append: appendTag,
    remove: removeTag
  } = useFieldArray({ control, name: "tags" });
  
  const onSubmit = (data: RecipeFormValues) => {
    onSave(data);
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-medium">Edit Recipe</h2>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                size="sm"
                className="bg-bread-800 hover:bg-bread-900"
                disabled={!isDirty}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Recipe
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium font-serif">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title</Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-destructive text-sm">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="introduction">
                Introduction <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="introduction"
                {...register("introduction")}
                placeholder="Share the story behind this recipe..."
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label htmlFor="prepTime" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Prep Time
                </Label>
                <Input
                  id="prepTime"
                  {...register("prepTime")}
                  placeholder="30 min"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restTime" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Rest Time
                </Label>
                <Input
                  id="restTime"
                  {...register("restTime")}
                  placeholder="2 hours"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bakeTime" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Bake Time
                </Label>
                <Input
                  id="bakeTime"
                  {...register("bakeTime")}
                  placeholder="45 min"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalTime" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Total Time
                </Label>
                <Input
                  id="totalTime"
                  {...register("totalTime")}
                  placeholder="3 hours"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="flex items-center">
                <Image className="h-3 w-3 mr-1" />
                Recipe Image URL
              </Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL for the recipe image or leave as is for a placeholder
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium font-serif">Ingredients</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendIngredient("")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>
            
            <div className="space-y-3">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`ingredients.${index}`)}
                    placeholder="500g (4 cups) bread flour"
                    className={errors.ingredients?.[index] ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
              {ingredientFields.length === 0 && (
                <p className="text-sm italic text-muted-foreground">
                  No ingredients added yet
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Instructions */}
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
          
          <Separator />
          
          {/* Tips and Pro Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium font-serif">Tips</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTip("")}
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
                  onClick={() => appendProTip("")}
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
          
          <Separator />
          
          {/* Equipment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium font-serif">Equipment Needed</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendEquipment({ name: "", affiliateLink: "" })}
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
                    onClick={() => removeEquipment(index)}
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
          
          <Separator />
          
          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium font-serif">Tags</h3>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Input 
                      id="new-tag"
                      placeholder="Add a tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          const value = input.value.trim();
                          if (value && !field.value.includes(value)) {
                            appendTag(value);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('new-tag') as HTMLInputElement;
                        const value = input.value.trim();
                        if (value && !field.value.includes(value)) {
                          appendTag(value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tagFields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  <Input
                    {...register(`tags.${index}`)}
                    className="hidden"
                  />
                  <span>{field.value}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-muted-foreground hover:text-destructive focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {tagFields.length === 0 && (
                <p className="text-sm italic text-muted-foreground">
                  No tags added yet
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-bread-800 hover:bg-bread-900"
              disabled={!isDirty}
            >
              Save Recipe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
