
import React from 'react';
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 dark:bg-bread-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4 section-title">Latest from the Blog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto dark:text-gray-300">
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
              <div className="col-span-3 text-center p-8 bg-destructive/10 rounded-lg">
                <p className="text-destructive dark:text-red-300">{error}</p>
                <p className="mt-4 dark:text-white">Please check back later for our latest articles.</p>
              </div>
            ) : posts && posts.length > 0 ? (
              // Show actual blog posts
              posts.slice(0, 3).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            ) : (
              // Show a message if no posts are available
              <div className="col-span-3 text-center p-8">
                <p className="dark:text-white">No blog posts available at the moment.</p>
                <p className="mt-4 dark:text-white">Please check back later for our latest articles.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-white dark:hover:bg-bread-800"
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
