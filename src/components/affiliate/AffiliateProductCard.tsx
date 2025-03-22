
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { AffiliateProduct } from './AffiliateGroup';

interface AffiliateProductCardProps {
  product: AffiliateProduct;
}

const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden border-bread-100 dark:border-bread-800 shadow-md hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">{product.name}</h3>
          {product.price && <span className="text-sm font-medium">{product.price}</span>}
        </div>
        <Button 
          className="w-full mt-4 bg-bread-800 hover:bg-bread-900 text-white"
          asChild
        >
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            Shop Now
            <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AffiliateProductCard;
