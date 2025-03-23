
import { Recipe } from './recipe';

export interface User {
  id: string;
  name: string;
  email: string;
  recipes: Recipe[];
  favorites: string[];
  createdAt: string;
}
