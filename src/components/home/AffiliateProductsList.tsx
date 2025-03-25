
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateProductCard, { AffiliateProduct } from './AffiliateProductCard';

interface AffiliateProductsListProps {
  products: AffiliateProduct[];
}

const AffiliateProductsList: React.FC<AffiliateProductsListProps> = ({ products }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        {products.map(product => (
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
