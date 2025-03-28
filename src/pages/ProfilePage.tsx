
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsiveWrapper from '@/components/recipe-converter/ResponsiveWrapper';
import ProfileHeader from '@/components/auth/ProfileHeader';
import ProfileForm from '@/components/auth/ProfileForm';
import ProfileErrorAlert from '@/components/auth/ProfileErrorAlert';

const ProfilePage = () => {
  useScrollToTop();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleUpdateProfile = async (values: { name: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use a more aggressive type assertion to bypass TypeScript's type checking
      const { error } = await (supabase as any)
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
      setError(error.message);
      toast({
        title: "Update failed",
        description: error.message || "There was a problem updating your profile.",
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
              <ProfileHeader 
                name={profile?.name} 
                email={user.email}
                avatarUrl={profile?.avatar_url}
              />

              <ProfileErrorAlert error={error} />

              <ProfileForm 
                initialName={profile?.name || ''} 
                onSubmit={handleUpdateProfile}
                loading={loading}
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
