
// Mock data for recipe searches and other AI-related functionality

// Mock challenges data
export const challenges = [
  {
    id: 'weekly-challenge-1',
    title: 'Sourdough Bread Challenge',
    description: 'Create your best sourdough bread with a unique twist. Show off your scoring and shaping skills!',
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-05-07'),
    difficulty: 'Intermediate',
    imageUrl: '/lovable-uploads/d32e1aa2-fbf9-4793-9f06-54206973eadd.png',
    link: 'https://bakinggreatbread.blog/challenges/sourdough-week'
  }
];

// Mock recipe data for search results
export const recipesData = [
  {
    id: 'recipe-1',
    title: "Classic Sourdough Bread",
    description: "A traditional sourdough recipe with a crispy crust and open crumb.",
    imageUrl: "/lovable-uploads/d32e1aa2-fbf9-4793-9f06-54206973eadd.png",
    link: "https://bakinggreatbread.blog/classic-sourdough"
  },
  {
    id: 'recipe-2',
    title: "Henry's Cinnamon Rolls",
    description: "Soft and fluffy cinnamon rolls with a sweet glaze, perfect for weekend mornings.",
    imageUrl: "/lovable-uploads/d509f155-02f5-4d8f-9830-a26e2632ba95.png",
    link: "https://bakinggreatbread.blog/henrys-cinnamon-rolls/"
  },
  {
    id: 'recipe-3',
    title: "Artisan Country Loaf",
    description: "A rustic country loaf with a mix of whole wheat and bread flour for great flavor.",
    imageUrl: "/lovable-uploads/a1e8e454-b660-424a-a223-abcf52875470.png",
    link: "https://bakinggreatbread.blog/artisan-country-loaf"
  }
];

// Mock function for generating recipes with OpenAI
export const generateRecipeWithOpenAI = async (prompt: string) => {
  // This is a mock implementation
  console.log(`Mock OpenAI recipe generation for: ${prompt}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock recipe data
  return {
    success: true,
    recipe: {
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)}`,
      introduction: `A delicious ${prompt} recipe created just for you.`,
      imageUrl: "/lovable-uploads/e000aa47-dec6-46ac-b437-e0a1985fcc5f.png",
      ingredients: [
        "2 cups flour",
        "1 cup sugar",
        "1/2 cup butter",
        "2 eggs",
        "1 tsp vanilla extract"
      ],
      instructions: [
        "Preheat oven to 350°F (175°C).",
        "Mix dry ingredients in a bowl.",
        "Add wet ingredients and stir until combined.",
        "Bake for 25-30 minutes until golden brown."
      ]
    }
  };
};
