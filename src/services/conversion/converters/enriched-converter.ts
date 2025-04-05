
import { BaseConverter } from '../base-converter';
import { ConversionResult, MeasurementSystem, RecipeData } from '../types';

export class EnrichedConverter extends BaseConverter {
  constructor() {
    super('enriched');
  }
  
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    // Get basic conversion from base class
    const baseResult = await super.convert(recipeData, targetSystem);
    
    // Add enriched dough specific notes
    if (!baseResult.converted.notes) {
      baseResult.converted.notes = [];
    }
    
    baseResult.converted.notes.push(
      `This is an enriched dough recipe with eggs, dairy, and/or fat.`,
      `For tender results, avoid overmixing and use room temperature ingredients.`
    );
    
    // Add enriched bread timings
    const timings: Record<string, string> = {
      'mixing': '8-12 minutes',
      'bulk fermentation': '1.5-2 hours at room temperature',
      'proofing': '45-90 minutes',
      'baking': '25-35 minutes at 350°F'
    };
    
    return {
      ...baseResult,
      timings
    };
  }
}
