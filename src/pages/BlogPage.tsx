
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useBlogPosts } from '@/services/BlogService';
import BlogPostCard, { BlogPostCardSkeleton } from '@/components/BlogPostCard';
import { useSearchParams } from 'react-router-dom';

const BlogPage = () => {
  useScrollToTop();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { posts, loading, error } = useBlogPosts();

  // Filter posts by category if category is specified
  const filteredPosts = category 
    ? posts?.filter(post => post.categories?.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      )) 
    : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Blog</h1>
          
          {category && (
            <p className="text-center mb-8 text-muted-foreground">
              Showing posts in category: <span className="font-medium text-primary">{category}</span>
            </p>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <BlogPostCardSkeleton key={id} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-destructive/10 rounded-lg">
              <p className="text-destructive">Failed to load blog posts</p>
              <p className="mt-4">Please try again later</p>
            </div>
          ) : (
            <>
              {filteredPosts && filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <p className="text-lg text-muted-foreground">
                    {category 
                      ? `No posts found in the "${category}" category.` 
                      : "No blog posts available at the moment."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
