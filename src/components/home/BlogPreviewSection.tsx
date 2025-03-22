
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/services/BlogService';
import BlogPostCard, { BlogPostCardSkeleton } from '@/components/BlogPostCard';

interface BlogPreviewSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({ sectionRef }) => {
  const { posts, loading, error } = useBlogPosts();
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 opacity-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Latest from the Blog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover tips, techniques, and stories from our community of passionate bakers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {loading ? (
              // Show skeletons when loading
              Array(3).fill(0).map((_, index) => (
                <BlogPostCardSkeleton key={index} />
              ))
            ) : error ? (
              // Show error message
              <div className="col-span-3 text-center p-8">
                <p className="text-red-500">{error}</p>
                <p className="mt-4">Please check back later for our latest articles.</p>
              </div>
            ) : (
              // Show actual blog posts
              posts.slice(0, 3).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 hover:bg-bread-50"
              asChild
            >
              <Link to="/blog">
                View all articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
