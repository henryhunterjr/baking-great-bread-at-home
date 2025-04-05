
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, UserPlus, AtSign, KeyRound, Check } from 'lucide-react';

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm your password' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  setAuthError: (error: string | null) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setAuthError }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          }
        }
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      toast({
        title: "Registration successful",
        description: "Welcome to Baking Great Bread at Home!",
      });
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-bread-700 dark:text-bread-300">Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-bread-500 dark:text-bread-400" />
                  <Input 
                    placeholder="Enter your name" 
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
                    placeholder="Create a password" 
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-bread-700 dark:text-bread-300">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Check className="absolute left-3 top-3 h-4 w-4 text-bread-500 dark:text-bread-400" />
                  <Input 
                    type="password" 
                    placeholder="Confirm your password" 
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
          {loading ? 'Creating account...' : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
