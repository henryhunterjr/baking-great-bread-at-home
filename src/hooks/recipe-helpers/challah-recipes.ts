
import { Recipe } from '@/components/recipes/types';

/**
 * Returns a collection of challah bread recipes as fallback
 * These are used when searching for challah specifically
 */
export function getChallahRecipes(): Recipe[] {
  return [
    {
      id: 'challah-1',
      title: "Traditional Challah Bread Recipe",
      description: "A traditional Jewish bread recipe for the Sabbath and holidays with a beautiful braided pattern and rich egg dough.",
      imageUrl: "https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?q=80&w=1000&auto=format&fit=crop",
      date: "2023-12-15",
      link: "https://bakinggreatbread.blog/challah-bread-recipe"
    },
    {
      id: 'challah-2',
      title: "Honey Challah Bread",
      description: "Sweetened with honey, this challah bread recipe creates a tender, flavorful loaf perfect for special occasions and holiday tables.",
      imageUrl: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop",
      date: "2023-10-05",
      link: "https://bakinggreatbread.blog/honey-challah-bread"
    },
    {
      id: 'challah-3',
      title: "Sourdough Discard Challah Bread",
      description: "Use your sourdough discard to create a flavorful and beautiful braided challah bread with a subtle tang and perfect texture.",
      imageUrl: "https://images.unsplash.com/photo-1590137876181-2a5a7e340de2?q=80&w=1000&auto=format&fit=crop",
      date: "2024-01-29",
      link: "https://bakinggreatbread.blog/sourdough-discard-challah-bread"
    }
  ];
}
