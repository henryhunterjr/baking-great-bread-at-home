
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPreviewSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

interface BlogPost {
  id: number;
  title: string;
  image: string;
  date: string;
  excerpt: string;
  link: string;
}

const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({ sectionRef }) => {
  // Latest blog posts
  const latestBlogs: BlogPost[] = [
    {
      id: 1,
      title: "Mastering Hydration Levels in Sourdough",
      image: "https://images.unsplash.com/photo-1588116272743-543e522deb8e?q=80&w=1000&auto=format&fit=crop",
      date: "May 15, 2023",
      excerpt: "Understanding how water content affects your bread's texture and crumb structure.",
      link: "/blog/hydration-levels"
    },
    {
      id: 2,
      title: "The Art of Scoring: Beyond Basic Patterns",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
      date: "April 28, 2023",
      excerpt: "Creative techniques to elevate your bread's appearance with decorative scoring.",
      link: "/blog/scoring-art"
    },
    {
      id: 3,
      title: "Cold Fermentation: Patience Yields Flavor",
      image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=1000&auto=format&fit=crop",
      date: "April 10, 2023",
      excerpt: "How slowing down the fermentation process can dramatically improve your bread's taste.",
      link: "/blog/cold-fermentation"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-bread-50/50 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Latest from the Blog</h2>
          <p className="section-subtitle">
            Tips, techniques, and inspiration to help you on your bread-making journey.
          </p>
          <img 
            src="/lovable-uploads/27ebc720-4afd-4d56-a5aa-364c66ef2d5c.png" 
            alt="Baking Great Bread at Home Blog" 
            className="mx-auto mt-4 max-w-xs"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((post) => (
            <Link to={post.link} key={post.id} className="group">
              <Card className="overflow-hidden card-hover border-bread-100 h-full flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="mb-3 text-xs text-muted-foreground">{post.date}</div>
                  <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-bread-800 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <div className="inline-flex items-center text-bread-800 text-sm font-medium group-hover:underline">
                    Read Article
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="ghost" 
            className="text-bread-800 hover:bg-bread-50"
            asChild
          >
            <Link to="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
