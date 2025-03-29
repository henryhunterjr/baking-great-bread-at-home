
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsiveWrapper from '@/components/recipe-converter/ResponsiveWrapper';
import ProfileHeader from '@/components/auth/ProfileHeader';
import ProfileForm from '@/components/auth/ProfileForm';
import ProfileErrorAlert from '@/components/auth/ProfileErrorAlert';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ProfilePage = () => {
  useScrollToTop();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableExists, setTableExists] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  // Check if profiles table exists
  useEffect(() => {
    const checkProfilesTable = async () => {
      try {
        await supabase.from('profiles').select('*').limit(1);
        setTableExists(true);
      } catch (error: any) {
        // If the error has a code of 42P01, it means the table doesn't exist
        if (error?.code === '42P01') {
          setTableExists(false);
        }
      }
    };
    
    if (user) {
      checkProfilesTable();
    }
  }, [user]);

  const handleUpdateProfile = async (values: { name: string }) => {
    try {
      if (!tableExists) {
        toast({
          title: "Database error",
          description: "The profiles table doesn't exist yet. Please contact the administrator.",
          variant: "destructive",
        });
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "There was a problem updating your profile.";
      setError(errorMessage);
      
      // Special case for missing table
      if (errorMessage.includes('does not exist')) {
        setTableExists(false);
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 md:py-16">
        <ResponsiveWrapper className="flex justify-center">
          <Card className="w-full max-w-md shadow-lg border-2">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-4">
              {!tableExists && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Database Error</AlertTitle>
                  <AlertDescription>
                    The profiles table doesn't exist in the database. This is needed to save your profile information.
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.reload()}
                        className="flex items-center"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh page
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <ProfileHeader 
                name={profile?.name || user.user_metadata?.name || ''} 
                email={user.email}
                avatarUrl={profile?.avatar_url || user.user_metadata?.avatar_url}
              />

              <ProfileErrorAlert error={error} />

              <ProfileForm 
                initialName={profile?.name || user.user_metadata?.name || ''} 
                onSubmit={handleUpdateProfile}
                loading={loading}
                disabled={!tableExists}
              />
            </CardContent>
            
            <CardFooter className="flex justify-center pb-6">
              <Button 
                variant="outline" 
                onClick={signOut}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </ResponsiveWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
