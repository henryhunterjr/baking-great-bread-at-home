
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Coffee, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeConverterNav = () => {
  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/recipes" className="flex items-center">
            <Coffee className="mr-2 h-4 w-4" />
            Recipes
          </Link>
        </Button>
        
        <Button variant="ghost" size="sm" asChild>
          <Link to="/guides" className="flex items-center">
            <Book className="mr-2 h-4 w-4" />
            Guides
          </Link>
        </Button>
        
        <Button variant="ghost" size="sm" asChild>
          <Link to="/challenges" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Challenges
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RecipeConverterNav;
