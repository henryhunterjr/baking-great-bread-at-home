
import React from 'react';
import { Button } from '@/components/ui/button';

const AuthFooter: React.FC = () => {
  return (
    <div className="p-4 pt-0 text-center text-xs text-muted-foreground">
      <p className="mb-4">
        By continuing, you agree to the Terms of Service and Privacy Policy of Baking Great Bread at Home with Henry.
      </p>
      <div className="flex justify-center space-x-4">
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Terms of Service
        </Button>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Privacy Policy
        </Button>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Help Center
        </Button>
      </div>
    </div>
  );
};

export default AuthFooter;
