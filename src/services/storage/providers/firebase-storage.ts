
import { Recipe, IStorageProvider } from '../types';
import { LocalStorageProvider } from './local-storage';
import { logError, logInfo } from '@/utils/logger';

export class FirebaseStorageProvider implements IStorageProvider {
  private localStorageFallback = new LocalStorageProvider();
  private isInitialized = false;
  private firestore: any = null;
  private initializationPromise: Promise<void> | null = null;
  
  constructor() {
    // Only try to initialize Firebase in browser environment
    // and only when actually needed (lazy initialization)
    this.isInitialized = false;
  }
  
  // Initialize Firebase lazily
  private initializeFirebase(): Promise<void> {
    // Only initialize once - return existing promise if in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = new Promise<void>(async (resolve) => {
      try {
        // In production, always use local storage fallback due to configuration issues
        if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
          this.isInitialized = false;
          logInfo('Firebase initialization skipped in production environment');
          resolve();
          return;
        }
        
        // Dynamically import Firebase to reduce initial bundle size
        const firebase = await import('firebase/app');
        const firestoreModule = await import('firebase/firestore');
        
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
        let app;
        try {
          app = firebase.initializeApp(firebaseConfig);
        } catch (initError) {
          // If app already exists, get the existing one
          if (initError.code === 'app/duplicate-app') {
            app = firebase.getApp();
            logInfo('Using existing Firebase app');
          } else {
            throw initError;
          }
        }
        
        this.firestore = firestoreModule.getFirestore(app);
        this.isInitialized = true;
        
        logInfo('Firebase initialized successfully');
        resolve();
      } catch (error) {
        this.isInitialized = false;
        logError('Firebase initialization error, using local storage fallback', { error });
        resolve(); // Resolve anyway, we'll fall back to local storage
      }
    });
    
    return this.initializationPromise;
  }
  
  private async getFirestore() {
    // In production, always return null to use the fallback
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
      return null;
    }
    
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
      const firestoreModule = await import('firebase/firestore');
      
      // Prepare the recipe data - ensure ID and timestamps
      const preparedRecipe = {
        ...recipeData,
        id: recipeData.id || crypto.randomUUID(),
        createdAt: recipeData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to Firestore
      await firestoreModule.setDoc(
        firestoreModule.doc(db, 'recipes', preparedRecipe.id), 
        preparedRecipe
      );
      logInfo('Recipe saved to Firebase', { recipeId: preparedRecipe.id });
      
      return true;
    } catch (error) {
      logError('Firebase storage error, using local storage fallback:', { error });
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
      const firestoreModule = await import('firebase/firestore');
      
      // Get all recipes from the collection
      const recipesSnapshot = await firestoreModule.getDocs(
        firestoreModule.collection(db, 'recipes')
      );
      const recipes: Recipe[] = [];
      
      recipesSnapshot.forEach((doc: any) => {
        recipes.push(doc.data() as Recipe);
      });
      
      logInfo('Recipes fetched from Firebase', { count: recipes.length });
      
      // Sort by updated date (newest first)
      return recipes.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      logError('Firebase retrieval error, using local storage fallback:', { error });
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
      const firestoreModule = await import('firebase/firestore');
      
      // Get the specific recipe
      const recipeSnapshot = await firestoreModule.getDoc(
        firestoreModule.doc(db, 'recipes', id)
      );
      
      if (recipeSnapshot.exists()) {
        return recipeSnapshot.data() as Recipe;
      }
      
      return null;
    } catch (error) {
      logError('Firebase recipe retrieval error, using local storage fallback:', { error });
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
      const firestoreModule = await import('firebase/firestore');
      
      // Delete the recipe
      await firestoreModule.deleteDoc(
        firestoreModule.doc(db, 'recipes', id)
      );
      logInfo('Recipe deleted from Firebase', { recipeId: id });
      
      return true;
    } catch (error) {
      logError('Firebase deletion error, using local storage fallback:', { error });
      return this.localStorageFallback.deleteRecipe(id);
    }
  }
}
