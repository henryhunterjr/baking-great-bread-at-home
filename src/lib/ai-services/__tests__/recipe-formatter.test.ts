import { formatToStandardRecipe } from '../recipe-formatter';
import type { RecipeData } from '@/types/unifiedRecipe';

jest.mock('@/utils/logger', () => ({ logInfo: jest.fn() }));

describe('recipe export compatibility', () => {
  test('exports numeric converter quantities as strings', () => {
    const recipe: RecipeData = {
      title: 'Test loaf',
      ingredients: [{ quantity: 500, unit: 'g', name: 'flour' }],
      instructions: ['Mix'],
    };
    expect(formatToStandardRecipe(recipe).ingredients).toEqual([
      { quantity: '500', unit: 'g', name: 'flour' },
    ]);
  });

  test('preserves string ingredient quantities', () => {
    expect(formatToStandardRecipe({
      title: 'Test loaf',
      ingredients: [{ quantity: '1/2', unit: 'cup', name: 'water' }],
      instructions: ['Mix'],
    }).ingredients).toEqual([{ quantity: '1/2', unit: 'cup', name: 'water' }]);
  });
});