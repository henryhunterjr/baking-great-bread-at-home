
import { BaseConverter } from '../base-converter';
import { ConversionResult, MeasurementSystem, RecipeData } from '../types';

export class StandardConverter extends BaseConverter {
  constructor() {
    super('standard');
  }
  
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    // Get basic conversion from base class
    const baseResult = await super.convert(recipeData, targetSystem);
    
    // Add standard recipe notes
    if (!baseResult.converted!.notes) {
      baseResult.converted!.notes = [];
    }
    
    baseResult.converted!.notes.push(
      `This recipe has been converted to ${targetSystem} units.`
    );
    
    return baseResult;
  }
}
