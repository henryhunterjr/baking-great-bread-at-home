
import { Recipe, IStorageProvider } from '../types';
import { LocalStorageProvider } from './local-storage';
import { logError, logInfo } from '@/utils/logger';

export class FirebaseStorageProvider implements IStorageProvider {
  private localStorageFallback = new LocalStorageProvider();
  private isInitialized = false;
  private firestore: any = null;
  
  constructor() {
    this.initializeFirebase().catch(err => {
      logError('Failed to initialize Firebase', { error: err });
    });
  }
  
  // Initialize Firebase
  private async initializeFirebase(): Promise<void> {
    try {
      // Dynamically import Firebase to reduce initial bundle size
      const { initializeApp } = await import('firebase/app');
      const { getFirestore } = await import('firebase/firestore');
      
      // Firebase configuration - in a real app, use environment variables
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      this.firestore = getFirestore(app);
      this.isInitialized = true;
      
      logInfo('Firebase initialized successfully');
    } catch (error) {
      this.isInitialized = false;
      logError('Firebase initialization error', { error });
      // We'll fall back to local storage when Firebase fails
    }
  }
  
  private async getFirestore() {
    if (!this.isInitialized) {
      try {
        await this.initializeFirebase();
      } catch (error) {
        logError('Failed to initialize Firebase on demand', { error });
        return null;
      }
    }
    return this.firestore;
  }
  
  async saveRecipe(recipeData: Recipe): Promise<boolean> {
    try {
      const db = await this.getFirestore();
      
      if (!db || !this.isInitialized) {
        logInfo('Firebase not initialized, falling back to local storage');
        return this.localStorageFallback.saveRecipe(recipeData);
      }
      
      // Import Firestore methods on-demand
      const { doc, setDoc, collection } = await import('firebase/firestore');
      
      // Prepare the recipe data - ensure ID and timestamps
      const preparedRecipe = {
        ...recipeData,
        id: recipeData.id || crypto.randomUUID(),
        createdAt: recipeData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'recipes', preparedRecipe.id), preparedRecipe);
      logInfo('Recipe saved to Firebase', { recipeId: preparedRecipe.id });
      
      return true;
    } catch (error) {
      logError('Firebase storage error:', { error });
      return this.localStorageFallback.saveRecipe(recipeData);
    }
  }
  
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const db = await this.getFirestore();
      
      if (!db || !this.isInitialized) {
        logInfo('Firebase not initialized, falling back to local storage');
        return this.localStorageFallback.getAllRecipes();
      }
      
      // Import Firestore methods on-demand
      const { collection, getDocs } = await import('firebase/firestore');
      
      // Get all recipes from the collection
      const recipesSnapshot = await getDocs(collection(db, 'recipes'));
      const recipes: Recipe[] = [];
      
      recipesSnapshot.forEach((doc) => {
        recipes.push(doc.data() as Recipe);
      });
      
      logInfo('Recipes fetched from Firebase', { count: recipes.length });
      
      // Sort by updated date (newest first)
      return recipes.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      logError('Firebase retrieval error:', { error });
      return this.localStorageFallback.getAllRecipes();
    }
  }
  
  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const db = await this.getFirestore();
      
      if (!db || !this.isInitialized) {
        logInfo('Firebase not initialized, falling back to local storage');
        return this.localStorageFallback.getRecipe(id);
      }
      
      // Import Firestore methods on-demand
      const { doc, getDoc } = await import('firebase/firestore');
      
      // Get the specific recipe
      const recipeSnapshot = await getDoc(doc(db, 'recipes', id));
      
      if (recipeSnapshot.exists()) {
        return recipeSnapshot.data() as Recipe;
      }
      
      return null;
    } catch (error) {
      logError('Firebase recipe retrieval error:', { error });
      return this.localStorageFallback.getRecipe(id);
    }
  }
  
  async deleteRecipe(id: string): Promise<boolean> {
    try {
      const db = await this.getFirestore();
      
      if (!db || !this.isInitialized) {
        logInfo('Firebase not initialized, falling back to local storage');
        return this.localStorageFallback.deleteRecipe(id);
      }
      
      // Import Firestore methods on-demand
      const { doc, deleteDoc } = await import('firebase/firestore');
      
      // Delete the recipe
      await deleteDoc(doc(db, 'recipes', id));
      logInfo('Recipe deleted from Firebase', { recipeId: id });
      
      return true;
    } catch (error) {
      logError('Firebase deletion error:', { error });
      return this.localStorageFallback.deleteRecipe(id);
    }
  }
}
