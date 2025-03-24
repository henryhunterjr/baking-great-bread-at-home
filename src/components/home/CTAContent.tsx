
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CTAButtonProps {
  to: string;
  label: string;
  variant?: 'primary' | 'secondary';
  isExternal?: boolean;
  icon?: React.ReactNode;
}

// Reusable CTA button component
const CTAButton: React.FC<CTAButtonProps> = ({ 
  to, 
  label, 
  variant = 'primary', 
  isExternal = false,
  icon = variant === 'primary' ? <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /> : <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
}) => {
  const buttonClassName = variant === 'primary'
    ? "bg-white text-bread-800 hover:bg-bread-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
    : "border-bread-100 text-white hover:bg-bread-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md";
  
  const buttonVariant = variant === 'primary' ? 'default' : 'outline';
  
  if (isExternal) {
    return (
      <Button 
        variant={buttonVariant}
        size="lg"
        className={buttonClassName}
        asChild
      >
        <a 
          href={to} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={label}
        >
          {label}
          {icon}
        </a>
      </Button>
    );
  }
  
  return (
    <Button 
      variant={buttonVariant}
      size="lg" 
      className={buttonClassName}
      asChild
    >
      <Link to={to} aria-label={label}>
        {label}
        {icon}
      </Link>
    </Button>
  );
};

// Memoize the CTAButton component
const MemoizedCTAButton = memo(CTAButton);

const CTAContent: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">Ready to Start Your Bread Journey?</h2>
      <p className="text-bread-100 text-lg mb-8 max-w-2xl mx-auto">
        Join me in my community of passionate home bakers and get access to exclusive recipes, tips, and monthly challenges.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <MemoizedCTAButton 
          to="/community" 
          label="Join the Community" 
          variant="primary"
        />
        <MemoizedCTAButton 
          to="https://bakinggreatbread.blog/https-bakinggreatbread-blog-subscribe/" 
          label="Subscribe to our Blog" 
          variant="secondary"
          isExternal
        />
      </div>
    </div>
  );
};

export default memo(CTAContent);
