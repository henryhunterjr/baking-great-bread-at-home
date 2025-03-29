
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
    <div className="min-h-screen flex flex-col bg-bread-50 dark:bg-bread-900/50">
      <Navbar />
      <main className="flex-grow py-12 md:py-20">
        <ResponsiveWrapper className="flex justify-center items-center">
          <div className="w-full max-w-md text-center mb-8">
            <img 
              src="/lovable-uploads/0edb092e-0896-4897-b638-d65d57c125c5.png" 
              alt="Henry M. Hunter Jr. signature" 
              className="h-24 mx-auto mb-4" 
            />
            <h1 className="text-3xl font-serif font-medium text-bread-800 dark:text-bread-100">
              Welcome to Baking Great Bread at Home
            </h1>
          </div>
          
          <Card className="w-full max-w-md shadow-xl border-2 overflow-hidden bg-white dark:bg-bread-800">
            <div className="h-3 bg-gradient-to-r from-bread-300 via-bread-400 to-bread-300 dark:from-bread-700 dark:via-bread-600 dark:to-bread-700"></div>
            
            <CardHeader className="text-center pt-8 pb-2">
              <CardTitle className="text-2xl font-bold text-bread-800 dark:text-bread-100">Join Our Baking Community</CardTitle>
              <CardDescription className="text-bread-600 dark:text-bread-300">Sign in to your account or create a new one</CardDescription>
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
            
            <CardFooter className="bg-bread-50/50 dark:bg-bread-900/20 mt-4">
              <AuthFooter />
            </CardFooter>
          </Card>
          
          <div className="w-full max-w-md mt-8 bg-bread-100/70 dark:bg-bread-800/50 p-4 rounded-lg shadow-md">
            <p className="text-center text-bread-700 dark:text-bread-300 italic">
              "The smell of good bread baking, like the sound of lightly flowing water, is indescribable in its evocation of innocence and delight."
              <span className="block mt-2 font-medium">— M.F.K. Fisher</span>
            </p>
          </div>
        </ResponsiveWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
