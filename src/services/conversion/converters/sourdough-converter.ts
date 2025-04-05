
import { BaseConverter } from '../base-converter';
import { ConversionResult, MeasurementSystem, RecipeData } from '../types';

export class SourdoughConverter extends BaseConverter {
  constructor() {
    super('sourdough');
  }
  
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    // Get basic conversion from base class
    const baseResult = await super.convert(recipeData, targetSystem);
    
    // Add sourdough-specific notes
    if (!baseResult.converted!.notes) {
      baseResult.converted!.notes = [];
    }
    
    baseResult.converted!.notes.push(
      `This is a sourdough recipe with ${baseResult.hydration}% hydration.`,
      `For best results, ensure your starter is active and at peak rise before mixing.`
    );
    
    // Add sourdough timings
    const timings: Record<string, string> = {
      'autolyse': '30-60 minutes',
      'bulk fermentation': '4-6 hours at room temperature',
      'proofing': '12-14 hours in refrigerator',
      'baking': '20 minutes covered at 500°F, 20-25 minutes uncovered at 450°F'
    };
    
    return {
      ...baseResult,
      timings
    };
  }
}
