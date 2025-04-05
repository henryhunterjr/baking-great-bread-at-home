
import React from 'react';
import { Home, ArrowLeft, Coffee, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeConverterNav = () => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force a hard navigation to home
    window.location.href = '/';
  };
  
  const handleNavClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = path;
  };
  
  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={handleHomeClick}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={handleNavClick('/recipes')}>
          <Coffee className="mr-2 h-4 w-4" />
          Recipes
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleNavClick('/guides')}>
          <Book className="mr-2 h-4 w-4" />
          Guides
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleNavClick('/challenges')}>
          <Calendar className="mr-2 h-4 w-4" />
          Challenges
        </Button>
      </div>
    </div>
  );
};

export default RecipeConverterNav;
