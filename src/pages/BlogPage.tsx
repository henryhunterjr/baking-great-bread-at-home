
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useBlogPosts } from '@/services/BlogService';
import BlogPostCard, { BlogPostCardSkeleton } from '@/components/BlogPostCard';

const BlogPage = () => {
  useScrollToTop();
  const { posts, loading, error } = useBlogPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">Blog</h1>
          
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-3 text-center">
                  <p>No blog posts available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
