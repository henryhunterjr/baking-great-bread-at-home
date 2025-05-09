import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Enhanced user profile with user preferences
interface UserProfile {
  id: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: {
    measurementSystem: 'metric' | 'imperial';
    bakingExperience: 'beginner' | 'intermediate' | 'advanced';
    favoriteBreads: string[];
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile data including preferences
  const fetchProfile = async (userId: string) => {
    try {
      // Use maybeSingle instead of single to handle the case when the profile doesn't exist
      // Fix: Use type casting to any to bypass TypeScript errors with Supabase table definitions
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // If no profile exists, try to create one but don't error if it fails
      // This is to handle cases where RLS might prevent profile creation
      if (!data) {
        console.log('No profile found, trying to fetch from auth.users');
        
        try {
          // Try to get user data from session metadata instead of creating a profile
          if (user) {
            const userMetadata = user.user_metadata;
            
            const defaultProfile: UserProfile = {
              id: userId,
              name: userMetadata?.name || user.email?.split('@')[0] || 'User',
              avatar_url: userMetadata?.avatar_url || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              preferences: {
                measurementSystem: 'metric',
                bakingExperience: 'beginner',
                favoriteBreads: [],
              }
            };
            
            return defaultProfile;
          }
        } catch (metadataError) {
          console.error('Error creating default profile from metadata:', metadataError);
        }
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Function to refresh the user profile data
  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  // Function to update user preferences
  const updateUserPreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    if (!user?.id || !profile) {
      toast({
        title: "Authentication error",
        description: "You need to be logged in to update preferences.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const currentPreferences = profile.preferences || {
        measurementSystem: 'metric',
        bakingExperience: 'beginner',
        favoriteBreads: []
      };
      
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences
      };
      
      // Fix: Use type casting to any to bypass TypeScript errors with Supabase table definitions
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ 
          preferences: updatedPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile({
        ...profile,
        preferences: updatedPreferences
      });
      
      toast({
        title: "Preferences updated",
        description: "Your baking preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating preferences",
        description: error.message || "There was a problem updating your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // When auth state changes
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
            setIsLoading(false);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id);
        setProfile(profileData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing you out.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
    refreshProfile,
    updateUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
