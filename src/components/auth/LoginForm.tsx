
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AtSign, KeyRound, LogIn } from 'lucide-react';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  setAuthError: (error: string | null) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setAuthError }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      toast({
        title: "Login successful",
        description: "Welcome back to Baking Great Bread at Home!",
      });
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-bread-700 dark:text-bread-300">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-bread-500 dark:text-bread-400" />
                  <Input 
                    placeholder="Enter your email" 
                    className="pl-10 border-bread-300 dark:border-bread-600 focus:border-bread-500 dark:focus:border-bread-400" 
                    {...field} 
                    disabled={loading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-bread-700 dark:text-bread-300">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-bread-500 dark:text-bread-400" />
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="pl-10 border-bread-300 dark:border-bread-600 focus:border-bread-500 dark:focus:border-bread-400" 
                    {...field} 
                    disabled={loading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-bread-700 hover:bg-bread-800 text-white flex items-center justify-center"
          disabled={loading}
        >
          {loading ? 'Logging in...' : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
