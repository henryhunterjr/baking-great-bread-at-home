
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ClickableBlockProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ClickableBlock: React.FC<ClickableBlockProps> = ({ 
  href, 
  children, 
  className = '',
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    // Check if external link
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener noreferrer');
    } else {
      navigate(href);
    }
  };
  
  return (
    <div 
      className={`cursor-pointer transition-all duration-300 hover:shadow-md ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Navigate to ${href}`}
    >
      {children}
    </div>
  );
};
