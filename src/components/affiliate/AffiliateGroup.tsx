
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AffiliateProductCard from './AffiliateProductCard';

export interface AffiliateProduct {
  name: string;
  price?: string;
  link: string;
  image: string;
}

export interface AffiliateGroupProps {
  group: {
    id: string;
    name: string;
    icon: string;
    description: string;
    discountCode?: string;
    products: AffiliateProduct[];
  };
}

const AffiliateGroup: React.FC<AffiliateGroupProps> = ({ group }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{group.icon}</span>
        <h2 className="text-2xl font-bold">{group.name}</h2>
        {group.discountCode && (
          <Badge className="ml-2 bg-amber-500 hover:bg-amber-600 text-white">
            Code: {group.discountCode}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mb-6">{group.description}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {group.products.map((product, index) => (
          <AffiliateProductCard 
            key={`${group.id}-${index}`} 
            product={product} 
          />
        ))}
      </div>
      
      <Separator className="mt-8" />
    </div>
  );
};

export default AffiliateGroup;
