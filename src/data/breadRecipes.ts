
/**
 * Data file containing special highlighted bread recipes with custom images.
 */
import { Recipe } from '@/components/recipes/types';

export const breadRecipes: Recipe[] = [
  {
    id: "custom-no-knead-sourdough",
    title: "Traditional No-Knead Sourdough",
    description: "A rustic, open-crumb sourdough with minimal effort and maximum flavor. Perfect for beginners and experienced bakers alike.",
    imageUrl: "/lovable-uploads/6ae0552e-9395-4a0b-9585-cd8a153351e2.png",
    date: new Date().toLocaleDateString(),
    link: "/recipes/no-knead-sourdough"
  },
  {
    id: "custom-french-baguettes",
    title: "French Baguettes",
    description: "Authentic French baguettes with a crispy crust and soft, airy interior. Master the traditional shaping technique for that perfect tear.",
    imageUrl: "/lovable-uploads/c155085e-5a16-4ac2-9f3f-7dc14fa06507.png",
    date: new Date().toLocaleDateString(),
    link: "/recipes/french-baguettes"
  },
  {
    id: "custom-focaccia",
    title: "Rosemary Focaccia",
    description: "Fluffy, olive oil-rich Italian focaccia with fresh rosemary. Makes a perfect base for sandwiches or a delicious side for any meal.",
    imageUrl: "/lovable-uploads/1750a2bf-bf8c-48bf-9ccc-faaec1d62fde.png", 
    date: new Date().toLocaleDateString(),
    link: "/recipes/rosemary-focaccia"
  },
  {
    id: "custom-marbled-loaf",
    title: "Marbled Purple Artisan Bread",
    description: "Stunning marbled artisan bread with a blend of purple yam and white flour for a beautiful pattern that's as delicious as it is beautiful.",
    imageUrl: "/lovable-uploads/1090ec62-1f06-4503-a171-2f3c32dcfe3a.png",
    date: new Date().toLocaleDateString(),
    link: "/recipes/marbled-bread"
  },
  {
    id: "custom-whole-wheat",
    title: "Honey Whole Wheat Bread",
    description: "A nutritious whole wheat sandwich bread with a touch of honey. Perfect for everyday sandwiches or toast with your morning coffee.",
    imageUrl: "/lovable-uploads/515a6ec8-b46f-45b1-b5f8-1230b78fdf69.png",
    date: new Date().toLocaleDateString(),
    link: "/recipes/honey-whole-wheat"
  }
];
