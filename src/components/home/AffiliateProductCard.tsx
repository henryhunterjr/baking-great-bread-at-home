
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface AffiliateProduct {
  id: number;
  brand: string;
  name: string;
  description: string;
  image: string;
  link: string;
  discountCode: string;
  icon: string;
}

interface AffiliateProductCardProps {
  product: AffiliateProduct;
}

const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden border-bread-100 dark:border-bread-800 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 aspect-square md:aspect-auto overflow-hidden">
          <img 
            src={product.image} 
            alt={`${product.brand} ${product.name}`} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-bold">{product.icon}</span>
              {product.discountCode && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Tag className="h-3 w-3 mr-1" />
                  Code: {product.discountCode}
                </Badge>
              )}
            </div>
            <h3 className="font-serif text-lg font-medium">{product.brand}</h3>
            <h4 className="font-bold text-xl mb-2">{product.name}</h4>
            <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
          </div>
          <Button 
            className="w-full bg-bread-800 hover:bg-bread-900 text-white mt-2"
            asChild
          >
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              Shop Now
              <ArrowRight className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AffiliateProductCard;
