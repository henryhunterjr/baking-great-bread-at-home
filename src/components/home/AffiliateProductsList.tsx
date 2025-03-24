
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateProductCard, { AffiliateProduct } from './AffiliateProductCard';
import { Badge } from '@/components/ui/badge';

interface AffiliateProductsListProps {
  products: AffiliateProduct[];
}

const AffiliateProductsList: React.FC<AffiliateProductsListProps> = ({ products }) => {
  return (
    <div>
      <h2 className="section-title text-center dark:text-white">Recommended Products</h2>
      <p className="section-subtitle text-center dark:text-gray-300 mb-3">
        Quality baking equipment I personally recommend and use
      </p>
      <p className="text-center text-sm text-muted-foreground dark:text-gray-400 mb-10">
        <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 border-amber-200 dark:border-amber-800">
          Affiliate Disclosure: I may earn a commission from purchases made through these links.
        </Badge>
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {products.map(product => (
          <AffiliateProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          asChild
          variant="outline"
          className="border-bread-800 text-bread-800 hover:bg-bread-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-bread-900"
        >
          <Link to="/affiliate-collection">
            View Full Affiliate Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AffiliateProductsList;
