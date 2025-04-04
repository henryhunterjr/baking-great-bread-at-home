
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Coffee, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeConverterNav = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    // Force a complete navigation reset
    navigate('/', { replace: true });
    // Clear any cached state that might be affecting navigation
    window.history.replaceState({}, document.title, '/');
    // Scroll to top immediately without animation
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/recipes', { replace: true })}>
          <Coffee className="mr-2 h-4 w-4" />
          Recipes
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => navigate('/guides', { replace: true })}>
          <Book className="mr-2 h-4 w-4" />
          Guides
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => navigate('/challenges', { replace: true })}>
          <Calendar className="mr-2 h-4 w-4" />
          Challenges
        </Button>
      </div>
    </div>
  );
};

export default RecipeConverterNav;
