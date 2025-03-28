
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

const AuthFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CardFooter className="flex-col space-y-2 pt-0 pb-6 px-6 text-center">
      <div className="text-sm text-muted-foreground">
        By signing up, you agree to our
        <Button 
          variant="link" 
          className="px-1 py-0 h-auto text-sm" 
          onClick={() => navigate('/terms-of-service')}
        >
          Terms of Service
        </Button>
        and
        <Button 
          variant="link" 
          className="px-1 py-0 h-auto text-sm" 
          onClick={() => navigate('/privacy-policy')}
        >
          Privacy Policy
        </Button>
      </div>
    </CardFooter>
  );
};

export default AuthFooter;
