
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(registerEmail, registerPassword, registerName);
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Sign in or create an account to save recipes and access more features.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 pt-4">
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <Input 
                    id="register-name" 
                    type="text" 
                    placeholder="Your Name" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
