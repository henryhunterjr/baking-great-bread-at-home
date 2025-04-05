
import { BaseConverter } from '../base-converter';
import { ConversionResult, MeasurementSystem, RecipeData } from '../types';

export class YeastedConverter extends BaseConverter {
  constructor() {
    super('yeasted');
  }
  
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    // Get basic conversion from base class
    const baseResult = await super.convert(recipeData, targetSystem);
    
    // Add yeasted bread specific notes
    if (!baseResult.converted!.notes) {
      baseResult.converted!.notes = [];
    }
    
    baseResult.converted!.notes.push(
      `This yeasted bread recipe has ${baseResult.hydration}% hydration.`,
      `Allow the dough to rise until doubled in size before shaping.`
    );
    
    // Add yeasted bread timings
    const timings: Record<string, string> = {
      'mixing': '10-15 minutes',
      'bulk fermentation': '1-2 hours at room temperature',
      'proofing': '45-60 minutes',
      'baking': '25-30 minutes at 400°F'
    };
    
    return {
      ...baseResult,
      timings
    };
  }
}
