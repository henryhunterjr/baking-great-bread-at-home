import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPreviewSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({ sectionRef }) => {
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
            {/* Blog post 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-bread-100 hover:shadow-md transition-shadow">
              <img 
                src="/lovable-uploads/a9a9a9a9-a9a9-a9a9-a9a9-a9a9a9a9a9a9.png" 
                alt="Sourdough starter maintenance" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-xs font-medium text-bread-800 bg-bread-100 rounded-full py-1 px-2">Technique</span>
                <h3 className="font-serif text-xl font-medium mt-2 mb-2">Maintaining Your Sourdough Starter</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  Learn the essential tips for keeping your sourdough starter healthy and active for perfect bread every time.
                </p>
                <Link to="/blog" className="text-bread-800 text-sm font-medium inline-flex items-center hover:underline">
                  Read more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
            
            {/* Blog post 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-bread-100 hover:shadow-md transition-shadow">
              <img 
                src="/lovable-uploads/b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b8b8.png" 
                alt="Bread scoring patterns" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-xs font-medium text-bread-800 bg-bread-100 rounded-full py-1 px-2">Art</span>
                <h3 className="font-serif text-xl font-medium mt-2 mb-2">The Art of Bread Scoring</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  Discover how to create beautiful patterns on your bread with simple scoring techniques that also improve baking.
                </p>
                <Link to="/blog" className="text-bread-800 text-sm font-medium inline-flex items-center hover:underline">
                  Read more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
            
            {/* Blog post 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-bread-100 hover:shadow-md transition-shadow">
              <img 
                src="/lovable-uploads/c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7.png" 
                alt="Bread hydration levels" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-xs font-medium text-bread-800 bg-bread-100 rounded-full py-1 px-2">Science</span>
                <h3 className="font-serif text-xl font-medium mt-2 mb-2">Understanding Bread Hydration</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  Explore how different hydration levels affect your bread's texture, flavor, and baking process.
                </p>
                <Link to="/blog" className="text-bread-800 text-sm font-medium inline-flex items-center hover:underline">
                  Read more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
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
