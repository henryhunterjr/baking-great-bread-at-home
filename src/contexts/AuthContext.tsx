
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  saveRecipe,
  toggleFavorite,
  isFavorite,
  getUserRecipes,
  getFavoriteRecipes
} from '@/lib/auth/auth-service';
import { Recipe } from '@/types/recipe';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveUserRecipe: (recipe: Recipe) => Promise<void>;
  toggleRecipeFavorite: (recipeId: string) => Promise<boolean>;
  isRecipeFavorite: (recipeId: string) => boolean;
  userRecipes: Recipe[];
  favoriteRecipes: Recipe[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  
  useEffect(() => {
    // Load initial data
    if (user) {
      setUserRecipes(getUserRecipes());
      setFavoriteRecipes(getFavoriteRecipes());
    } else {
      setUserRecipes([]);
      setFavoriteRecipes([]);
    }
  }, [user]);
  
  const register = async (email: string, password: string, name: string) => {
    try {
      const newUser = registerUser({ email, password }, name);
      setUser(newUser);
      setUserRecipes([]);
      setFavoriteRecipes([]);
    } catch (error) {
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const user = loginUser({ email, password });
      setUser(user);
      setUserRecipes(getUserRecipes());
      setFavoriteRecipes(getFavoriteRecipes());
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    logoutUser();
    setUser(null);
    setUserRecipes([]);
    setFavoriteRecipes([]);
  };
  
  const saveUserRecipe = async (recipe: Recipe) => {
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    try {
      saveRecipe(recipe);
      setUserRecipes(getUserRecipes());
      setFavoriteRecipes(getFavoriteRecipes());
    } catch (error) {
      throw error;
    }
  };
  
  const toggleRecipeFavorite = async (recipeId: string) => {
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    try {
      const newState = toggleFavorite(recipeId);
      setFavoriteRecipes(getFavoriteRecipes());
      return newState;
    } catch (error) {
      throw error;
    }
  };
  
  const isRecipeFavorite = (recipeId: string) => {
    return isFavorite(recipeId);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        saveUserRecipe,
        toggleRecipeFavorite,
        isRecipeFavorite,
        userRecipes,
        favoriteRecipes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
