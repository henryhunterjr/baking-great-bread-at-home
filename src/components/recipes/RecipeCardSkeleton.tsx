
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const RecipeCardSkeleton = () => (
  <div className="rounded-lg border border-bread-100 overflow-hidden h-full flex flex-col">
    <div className="aspect-video">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="p-6 flex-grow">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <Skeleton className="h-4 w-32 mt-auto" />
    </div>
  </div>
);

export default RecipeCardSkeleton;
