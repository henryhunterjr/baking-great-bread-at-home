
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateProductCard, { AffiliateProduct } from './AffiliateProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface AffiliateProductsListProps {
  products: AffiliateProduct[];
}

const AffiliateProductsList: React.FC<AffiliateProductsListProps> = ({ products }) => {
  const isMobile = useIsMobile();
  
  // Show all products on desktop, fewer on mobile for performance
  const displayProducts = isMobile ? products.slice(0, 2) : products;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8">
        {displayProducts.map(product => (
          <AffiliateProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button 
          asChild
          variant="outline"
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900 transition-all duration-300"
        >
          <Link to="/affiliate-collection" className="flex items-center">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        
        <Button 
          asChild
          variant="outline"
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900 transition-all duration-300"
        >
          <Link to="/testimonials" className="flex items-center">
            Testimonials
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(AffiliateProductsList);
