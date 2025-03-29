
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
    <div className="min-h-screen flex flex-col bg-bread-900 dark:bg-bread-950">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 md:py-20">
        <ResponsiveWrapper className="w-full max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side: Welcome content */}
            <div className="text-white text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                Welcome to Baking Great Bread at Home
              </h1>
              <img 
                src="/lovable-uploads/0edb092e-0896-4897-b638-d65d57c125c5.png" 
                alt="Henry M. Hunter Jr. signature" 
                className="h-16 mx-auto md:mx-0 invert" 
              />
              <blockquote className="italic text-bread-200 max-w-md mx-auto md:mx-0">
                "The smell of good bread baking, like the sound of lightly flowing water, is indescribable in its evocation of innocence and delight." 
                <span className="block mt-2 font-medium text-white">— M.F.K. Fisher</span>
              </blockquote>
            </div>

            {/* Right side: Authentication Card */}
            <Card className="w-full max-w-md mx-auto shadow-2xl border-2 overflow-hidden bg-bread-800">
              <CardHeader className="text-center pt-8 pb-4">
                <CardTitle className="text-2xl font-bold text-white">Join Our Baking Community</CardTitle>
                <CardDescription className="text-bread-300">Sign in to your account or create a new one</CardDescription>
              </CardHeader>
              
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-bread-900/50">
                  <TabsTrigger value="login" className="text-white">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-white">Sign Up</TabsTrigger>
                </TabsList>
                
                <AuthErrorAlert error={authError} />
                
                <TabsContent value="login">
                  <LoginForm setAuthError={setAuthError} />
                </TabsContent>
                
                <TabsContent value="signup">
                  <SignupForm setAuthError={setAuthError} />
                </TabsContent>
              </Tabs>
              
              <CardFooter className="bg-bread-900/20 mt-4">
                <AuthFooter />
              </CardFooter>
            </Card>
          </div>
        </ResponsiveWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
