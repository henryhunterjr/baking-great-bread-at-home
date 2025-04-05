
import { BaseConverter } from '../base-converter';
import { ConversionResult, MeasurementSystem, RecipeData } from '../types';

export class QuickBreadConverter extends BaseConverter {
  constructor() {
    super('quickbread');
  }
  
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    // Get basic conversion from base class
    const baseResult = await super.convert(recipeData, targetSystem);
    
    // Add quickbread specific notes
    if (!baseResult.converted!.notes) {
      baseResult.converted!.notes = [];
    }
    
    baseResult.converted!.notes.push(
      `This is a quick bread recipe that uses chemical leaveners instead of yeast.`,
      `For best results, mix just until ingredients are combined to avoid tough texture.`
    );
    
    // Add quickbread timings
    const timings: Record<string, string> = {
      'mixing': '2-3 minutes',
      'resting': '0-10 minutes',
      'baking': '45-60 minutes at 350°F'
    };
    
    return {
      ...baseResult,
      timings
    };
  }
}
