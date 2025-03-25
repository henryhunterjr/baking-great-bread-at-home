
import React from 'react';
import { Badge } from '@/components/ui/badge';

const BlogHeader = () => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <Badge variant="blog" className="mb-6 px-4 py-1 text-sm tracking-wider">
        BLOG
      </Badge>
      <h1 className="section-title text-4xl md:text-5xl font-serif font-medium mb-4">
        Baking Great Bread at Home Blog
      </h1>
      <p className="section-subtitle text-xl text-muted-foreground">
        Crafting Bread, Cultivating Community.
      </p>
      <img 
        src="/lovable-uploads/27ebc720-4afd-4d56-a5aa-364c66ef2d5c.png" 
        alt="Baking Great Bread at Home Blog" 
        className="mx-auto mt-6 max-w-xs"
      />
    </div>
  );
};

export default BlogHeader;
