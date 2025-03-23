
import { User } from '@/types/user';
import { Recipe } from '@/types/recipe';

// Mock storage for users
const USERS_STORAGE_KEY = 'bakinggreatbread_users';
const CURRENT_USER_KEY = 'bakinggreatbread_current_user';

// Types for user management
interface UserCredentials {
  email: string;
  password: string;
}

// Get users from local storage
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Save users to local storage
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Get current user from local storage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Save current user to local storage
const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Register a new user
export const registerUser = (credentials: UserCredentials, name: string): User => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === credentials.email)) {
    throw new Error('Email already registered');
  }
  
  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email: credentials.email,
    recipes: [],
    favorites: [],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);
  
  return newUser;
};

// Login user
export const loginUser = (credentials: UserCredentials): User => {
  const users = getUsers();
  
  // Find user by email
  const user = users.find(user => user.email === credentials.email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, we would check the password hash
  // For this demo, we're skipping password verification
  
  saveCurrentUser(user);
  return user;
};

// Logout user
export const logoutUser = (): void => {
  saveCurrentUser(null);
};

// Save recipe to user's collection
export const saveRecipe = (recipe: Recipe): void => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not logged in');
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Check if recipe already exists
  const recipeIndex = currentUser.recipes.findIndex(r => 
    r.title === recipe.title && 
    r.description === recipe.description
  );
  
  if (recipeIndex === -1) {
    // Add recipe with unique ID
    const recipeWithId = {
      ...recipe,
      id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    currentUser.recipes.push(recipeWithId);
  } else {
    // Update existing recipe
    currentUser.recipes[recipeIndex] = {
      ...recipe,
      id: currentUser.recipes[recipeIndex].id
    };
  }
  
  users[userIndex] = currentUser;
  saveUsers(users);
  saveCurrentUser(currentUser);
};

// Toggle recipe favorite status
export const toggleFavorite = (recipeId: string): boolean => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('User not logged in');
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Check if recipe is already a favorite
  const isFavorite = currentUser.favorites.includes(recipeId);
  
  if (isFavorite) {
    // Remove from favorites
    currentUser.favorites = currentUser.favorites.filter(id => id !== recipeId);
  } else {
    // Add to favorites
    currentUser.favorites.push(recipeId);
  }
  
  users[userIndex] = currentUser;
  saveUsers(users);
  saveCurrentUser(currentUser);
  
  return !isFavorite;
};

// Check if recipe is a favorite
export const isFavorite = (recipeId: string): boolean => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return false;
  }
  
  return currentUser.favorites.includes(recipeId);
};

// Get user's recipes
export const getUserRecipes = (): Recipe[] => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return [];
  }
  
  return currentUser.recipes;
};

// Get user's favorite recipes
export const getFavoriteRecipes = (): Recipe[] => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return [];
  }
  
  return currentUser.recipes.filter(recipe => 
    currentUser.favorites.includes(recipe.id!)
  );
};
