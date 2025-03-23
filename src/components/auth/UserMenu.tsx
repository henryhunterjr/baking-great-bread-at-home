
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/my-recipes')}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>My Recipes</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/favorites')}>
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)}>
          Sign In
        </Button>
      )}
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default UserMenu;
