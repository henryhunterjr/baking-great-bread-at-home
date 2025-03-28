
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsiveWrapper from '@/components/recipe-converter/ResponsiveWrapper';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import AuthErrorAlert from '@/components/auth/AuthErrorAlert';
import AuthFooter from '@/components/auth/AuthFooter';

const AuthPage = () => {
  useScrollToTop();
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 md:py-16">
        <ResponsiveWrapper className="flex justify-center items-center">
          <Card className="w-full max-w-md shadow-lg border-2">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Welcome to Baking Great Bread at Home with Henry</CardTitle>
              <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <AuthErrorAlert error={authError} />
              
              <TabsContent value="login">
                <LoginForm setAuthError={setAuthError} />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm setAuthError={setAuthError} />
              </TabsContent>
            </Tabs>
            
            <AuthFooter />
          </Card>
        </ResponsiveWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
