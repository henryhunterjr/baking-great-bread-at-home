
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import BlogPostCard from '../components/BlogPostCard';
import { useBlogPosts } from '../services/blog/useBlogPosts';
import { BlogPost } from '../services/blog/types';

const BlogPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { posts, loading, error } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    if (posts) {
      let filtered = [...posts];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by selected tag if any
      if (selectedTag) {
        filtered = filtered.filter(post => 
          post.tags && post.tags.includes(selectedTag)
        );
      }
      
      setFilteredPosts(filtered);
    }
  }, [posts, searchTerm, selectedTag]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(prevTag => (prevTag === tag ? null : tag));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center">Loading blog posts...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center text-red-500">Error loading blog posts.</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Extract all unique tags from posts with proper type safety
  const allTags = posts ? Array.from(
    new Set(
      posts
        .flatMap(post => (post.tags || []))
        .filter(tag => typeof tag === 'string')
    )
  ) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <Input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-2 md:mb-0 md:w-1/3"
          />

          <div className="flex items-center space-x-2">
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "secondary" : "outline"}
                    onClick={() => handleTagClick(tag)}
                    size="sm"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
            {(searchTerm || selectedTag) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
