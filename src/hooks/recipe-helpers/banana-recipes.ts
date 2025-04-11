
import { Recipe } from '@/components/recipes/types';

/**
 * Get a curated list of banana bread recipes
 * This function provides dedicated banana bread recipes for the search functionality
 */
export function getBananaRecipes(): Recipe[] {
  return [
    {
      id: 'classic-banana-bread',
      title: 'Classic Banana Bread',
      description: 'A moist and flavorful banana bread that\'s perfect for using up overripe bananas.',
      imageUrl: 'https://images.unsplash.com/photo-1594086385051-a72d28c7b99a?q=80&w=1000&auto=format&fit=crop',
      date: 'March 15, 2024',
      link: '/recipes/classic-banana-bread',
      tags: ['quick-bread', 'sweet', 'breakfast']
    },
    {
      id: 'chocolate-chip-banana-bread',
      title: 'Chocolate Chip Banana Bread',
      description: 'The perfect combination of ripe bananas and chocolate chips in a moist, delicious loaf.',
      imageUrl: '/lovable-uploads/b924f7a9-e665-495b-b90f-d8d5166775f8.png',
      date: 'March 10, 2024',
      link: '/recipes/chocolate-chip-banana-bread',
      tags: ['quick-bread', 'sweet', 'chocolate']
    },
    {
      id: 'whole-wheat-banana-bread',
      title: 'Whole Wheat Banana Bread',
      description: 'A healthier take on the classic, using whole wheat flour and less sugar while maintaining that delicious banana flavor.',
      imageUrl: 'https://images.unsplash.com/photo-1585023657880-8d726c65ba4e?q=80&w=1000&auto=format&fit=crop',
      date: 'February 25, 2024',
      link: '/recipes/whole-wheat-banana-bread',
      tags: ['quick-bread', 'sweet', 'healthy']
    },
    {
      id: 'banana-nut-bread',
      title: 'Banana Nut Bread',
      description: 'Classic banana bread studded with walnuts for extra crunch and flavor.',
      imageUrl: '/lovable-uploads/d279b7e7-b262-4eb6-912b-a8c7a48d8715.png',
      date: 'February 18, 2024',
      link: '/recipes/banana-nut-bread',
      tags: ['quick-bread', 'sweet', 'nuts']
    },
    {
      id: 'banana-oat-bread',
      title: 'Banana Oatmeal Bread',
      description: 'Hearty banana bread with rolled oats for extra texture and nutrition.',
      imageUrl: '/lovable-uploads/b2f7ecab-0fa4-487d-b5e4-3ff94c107523.png',
      date: 'February 10, 2024',
      link: '/recipes/banana-oatmeal-bread',
      tags: ['quick-bread', 'sweet', 'breakfast', 'healthy']
    }
  ];
}
