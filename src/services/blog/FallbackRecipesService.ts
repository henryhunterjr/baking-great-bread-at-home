
import { BlogPost } from './types';

class FallbackRecipesService {
  getChallahRecipes(): BlogPost[] {
    // Dedicated challah recipes to ensure we always have results for this search
    return [
      {
        id: 2001,
        title: "Traditional Challah Bread Recipe",
        excerpt: "A traditional Jewish bread recipe for the Sabbath and holidays with a beautiful braided pattern.",
        date: "2023-12-15",
        imageUrl: "https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?q=80&w=1000&auto=format&fit=crop",
        link: "https://bakinggreatbread.blog/challah-bread-recipe"
      },
      {
        id: 2002,
        title: "Honey Challah Bread",
        excerpt: "Sweetened with honey, this challah bread recipe creates a tender, flavorful loaf perfect for special occasions.",
        date: "2023-10-05",
        imageUrl: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop",
        link: "https://bakinggreatbread.blog/honey-challah-bread"
      },
      {
        id: 2003,
        title: "Sourdough Discard Challah Bread",
        excerpt: "Use your sourdough discard to create a flavorful and beautiful braided challah bread.",
        date: "2024-01-29",
        imageUrl: "https://images.unsplash.com/photo-1590137876181-2a5a7e340de2?q=80&w=1000&auto=format&fit=crop",
        link: "https://bakinggreatbread.blog/sourdough-discard-challah-bread"
      }
    ];
  }
  
  getFallbackRecipes(): BlogPost[] {
    // Ensure we have some reliable fallback recipes for common bread types
    return [
      {
        id: 1001,
        title: "Whole Wheat Challah Bread",
        excerpt: "A healthier version of the traditional Jewish bread with whole wheat flour for added nutrition.",
        date: "2023-11-15",
        imageUrl: "https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?q=80&w=1000&auto=format&fit=crop",
        link: "https://bakinggreatbread.blog/whole-wheat-challah-bread"
      },
      {
        id: 1002,
        title: "Overnight No-Knead Bread",
        excerpt: "A simple bread recipe that requires minimal effort and creates a bakery-quality loaf.",
        date: "2023-10-05",
        imageUrl: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop",
        link: "https://bakinggreatbread.blog/overnight-no-knead-bread"
      },
      {
        id: 1003,
        title: "Classic Sourdough Bread",
        excerpt: "Master the art of sourdough bread baking with this comprehensive guide and recipe.",
        date: "2024-01-29",
        imageUrl: "https://images.unsplash.com/photo-1590137876181-2a5a7e340de2?q=80&w=1000&auto=format&fit=crop",
        link: "https://bakinggreatbread.blog/classic-sourdough-bread"
      }
    ];
  }
}

export default FallbackRecipesService;
