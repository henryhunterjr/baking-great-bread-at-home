
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeData } from '@/types/recipeTypes';
import { Clock, Edit, Search, Trash2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getSavedRecipes, deleteRecipe } from '@/utils/storage-helpers';
import { storageService } from '@/services/StorageService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MyRecipes: React.FC = () => {
  useScrollToTop();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [storageProvider, setStorageProvider] = useState(localStorage.getItem('storage_provider') || 'local');
  
  useEffect(() => {
    // Load recipes from storage service
    loadRecipes();
  }, [storageProvider]);
  
  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const loadedRecipes = await getSavedRecipes();
      setRecipes(loadedRecipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      toast({
        title: "Error Loading Recipes",
        description: "There was a problem loading your saved recipes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteRecipe = async (id: string) => {
    try {
      const success = await deleteRecipe(id);
      if (success) {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        toast({
          title: "Recipe Deleted",
          description: "The recipe has been removed from your collection.",
        });
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete this recipe. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditRecipe = (recipe: RecipeData) => {
    // Store the recipe to edit in localStorage
    localStorage.setItem('recipeToEdit', JSON.stringify(recipe));
    // Navigate to the recipe converter page
    navigate('/recipe-converter');
  };

  const handleChangeStorage = async (provider: string) => {
    if (provider === storageProvider) return;
    
    setIsLoading(true);
    try {
      await storageService.switchProvider(provider as any);
      setStorageProvider(provider);
      toast({
        title: "Storage Changed",
        description: `Your recipes are now stored in ${provider === 'local' ? 'browser storage' : provider}.`,
      });
    } catch (error) {
      console.error('Error changing storage:', error);
      toast({
        title: "Error",
        description: "Could not change storage provider.",
        variant: "destructive"
      });
    }
  };
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipe.tags && recipe.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">My Recipes</h1>
            <p className="text-muted-foreground">
              Your personal collection of saved and converted recipes.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <Select value={storageProvider} onValueChange={handleChangeStorage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Storage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Browser Storage</SelectItem>
                  <SelectItem value="firebase" disabled>Firebase (Soon)</SelectItem>
                  <SelectItem value="cloud" disabled>Cloud Storage (Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No Saved Recipes Yet</h2>
            <p className="text-muted-foreground mb-6">
              Convert or create recipes to save them to your collection.
            </p>
            <Button onClick={() => navigate('/recipe-converter')}>
              Go to Recipe Converter
            </Button>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No Matching Recipes</h2>
            <p className="text-muted-foreground">
              Try a different search term or clear your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={recipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                
                <CardHeader className="flex-grow">
                  <CardTitle className="font-serif">{recipe.title}</CardTitle>
                  <CardDescription>
                    {recipe.introduction ? (
                      recipe.introduction.substring(0, 100) + (recipe.introduction.length > 100 ? '...' : '')
                    ) : 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.tags && recipe.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {(recipe.prepTime || recipe.bakeTime || recipe.totalTime) && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {recipe.totalTime || `${recipe.prepTime || 'N/A'} prep + ${recipe.bakeTime || 'N/A'} bake`}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditRecipe(recipe)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => recipe.id && handleDeleteRecipe(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyRecipes;
