
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Facebook, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthFooter = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Separator className="flex-grow bg-bread-200 dark:bg-bread-700" />
        <span className="text-xs text-bread-500 dark:text-bread-400 font-medium">OR CONTINUE WITH</span>
        <Separator className="flex-grow bg-bread-200 dark:bg-bread-700" />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="border-bread-300 dark:border-bread-700">
          <Mail className="h-4 w-4 mr-2 text-bread-600 dark:text-bread-400" />
          <span className="text-xs">Email</span>
        </Button>
        <Button variant="outline" size="sm" className="border-bread-300 dark:border-bread-700">
          <Github className="h-4 w-4 mr-2 text-bread-600 dark:text-bread-400" />
          <span className="text-xs">GitHub</span>
        </Button>
        <Button variant="outline" size="sm" className="border-bread-300 dark:border-bread-700">
          <Facebook className="h-4 w-4 mr-2 text-bread-600 dark:text-bread-400" />
          <span className="text-xs">Facebook</span>
        </Button>
      </div>
      
      <div className="text-center pt-2">
        <p className="text-xs text-bread-500 dark:text-bread-400">
          By continuing, you agree to our{' '}
          <Link to="/terms-of-service" className="text-bread-700 dark:text-bread-300 underline hover:text-bread-800">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="text-bread-700 dark:text-bread-300 underline hover:text-bread-800">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthFooter;
