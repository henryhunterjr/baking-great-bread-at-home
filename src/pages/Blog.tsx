
import React from 'react';
import { useBlogPosts } from '@/services/BlogService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAnimatedSections } from '@/hooks/blog/useAnimatedSections';
import { useBlogSearch } from '@/hooks/blog/useBlogSearch';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogResults from '@/components/blog/BlogResults';

const Blog = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    debouncedSearchQuery, 
    isRefreshing, 
    handleSearch, 
    clearSearch, 
    refreshPosts 
  } = useBlogSearch();
  
  const { posts, loading, error } = useBlogPosts(debouncedSearchQuery);
  const { sectionRefs } = useAnimatedSections();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section 
        ref={(el) => sectionRefs.current[0] = el}
        className="pt-32 pb-16 md:pt-40 md:pb-20 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BlogHeader />
          
          <BlogSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            refreshPosts={refreshPosts}
            isRefreshing={isRefreshing}
          />
        </div>
      </section>
      
      <section 
        ref={(el) => sectionRefs.current[1] = el}
        className="pb-20 opacity-0"
      >
        <BlogResults 
          debouncedSearchQuery={debouncedSearchQuery}
          posts={posts}
          loading={loading}
          error={error}
          refreshPosts={refreshPosts}
          clearSearch={clearSearch}
        />
      </section>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Blog;
