
import React from 'react';
import { Home, Coffee, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RecipeConverterNav = () => {
  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/recipes">
            <Coffee className="mr-2 h-4 w-4" />
            Recipes
          </Link>
        </Button>
        
        <Button variant="ghost" size="sm" asChild>
          <Link to="/guides">
            <Book className="mr-2 h-4 w-4" />
            Guides
          </Link>
        </Button>
        
        <Button variant="ghost" size="sm" asChild>
          <Link to="/challenges">
            <Calendar className="mr-2 h-4 w-4" />
            Challenges
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RecipeConverterNav;
