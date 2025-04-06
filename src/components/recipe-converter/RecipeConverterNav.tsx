
import React from 'react';
import { Home, Coffee, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

const RecipeConverterNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Enhanced navigation handler to prevent getting stuck
  const handleNavigation = (path: string) => {
    // Force a full page refresh if already on the same page
    if (location.pathname === path) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };
  
  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleNavigation("/")}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => handleNavigation("/recipes")}>
          <Coffee className="mr-2 h-4 w-4" />
          Recipes
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => handleNavigation("/guides")}>
          <Book className="mr-2 h-4 w-4" />
          Guides
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => handleNavigation("/challenges")}>
          <Calendar className="mr-2 h-4 w-4" />
          Challenges
        </Button>
      </div>
    </div>
  );
};

export default RecipeConverterNav;
