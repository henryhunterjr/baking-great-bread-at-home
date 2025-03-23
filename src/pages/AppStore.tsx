import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AppItem {
  id: number;
  title: string;
  description: string;
  link: string;
  isExternalLink: boolean;
  image?: string;
}

const AppStore = () => {
  // Refs for animation elements
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Observer setup for animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe hero section
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    // Observe other sections
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // App items with links and descriptions
  const appItems: AppItem[] = [
    {
      id: 1,
      title: "Yeast Water Mastery Quiz",
      description: "Quiz testing yeast water knowledge",
      link: "https://yeast-water-wisdom.vercel.app",
      isExternalLink: true,
      image: "/lovable-uploads/b9db2710-1497-4a21-b305-c29ebe05af4c.png"
    },
    {
      id: 2,
      title: "YeastWise – Yeast Calculator",
      description: "Calculator for yeast-related conversions",
      link: "https://yeast-helper-101.vercel.app",
      isExternalLink: true,
      image: "/lovable-uploads/b67e2b91-a93b-466a-aa1d-4e506050d524.png"
    },
    {
      id: 3,
      title: "Crust & Crumb – Baking Calculators",
      description: "Comprehensive suite of baking calculation tools for professionals and home bakers",
      link: "https://bit.ly/4e6FEyf",
      isExternalLink: true,
      image: "/lovable-uploads/2fc62c54-8a7b-4d6c-b985-d1682a483f47.png"
    },
    {
      id: 4,
      title: "Loaf Logic",
      description: "A comprehensive bread calculator and recipe manager for the serious home baker",
      link: "https://loaflogic.lovable.app/",
      isExternalLink: true,
      image: "/lovable-uploads/52620bca-626b-437f-b87c-fbaf76026a26.png"
    },
    {
      id: 5,
      title: "Hydration Calculator (Blog)",
      description: "Blog-based hydration calculator for bakers with additional tips and insights",
      link: "https://bakinggreatbread.blog/2024/01/13/hydration-calc",
      isExternalLink: true,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "The Baker's Quiz",
      description: "Interactive quiz for assessing your bread baking knowledge and skills",
      link: "https://bakers-quizfest.lovable.app/",
      isExternalLink: true,
      image: "/lovable-uploads/43096bea-2727-4df7-ab45-0e160b2c1f73.png"
    },
    {
      id: 7,
      title: "Baking Great Bread at Home Quiz",
      description: "Test your understanding of bread baking fundamentals and techniques",
      link: "https://bit.ly/BGBAtQuiz",
      isExternalLink: true,
      image: "https://images.unsplash.com/photo-1603803721487-56d8544f2658?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 8,
      title: "Bakers Calculator",
      description: "Simple and effective baking ratio calculator for perfectly scaled recipes",
      link: "https://bit.ly/46LAJRt",
      isExternalLink: true,
      image: "https://images.unsplash.com/photo-1568376794508-ae52c6ab3929?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 9,
      title: "Vitale Sourdough Mastery Quiz",
      description: "Advanced quiz about sourdough baking techniques and principles",
      link: "https://websim.ai/c/9kOvx5voUJA6yAh",
      isExternalLink: true,
      image: "https://images.unsplash.com/photo-1586444248879-bc604cbd555a?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="pt-32 pb-20 md:pt-40 md:pb-28 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-bread-200 rounded-full text-bread-800 bg-bread-50 mb-4">
                Digital Tools
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                Bread Baking <span className="text-bread-800">Apps & Tools</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6">
                Discover our collection of specialized tools and apps to enhance your bread baking journey. From hydration calculators to interactive quizzes, find the perfect digital companions for your baking adventures.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* App Listings */}
      <section 
        ref={(el) => sectionRefs.current[0] = el}
        className="py-16 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appItems.map((app) => (
                <Card key={app.id} className="overflow-hidden card-hover border-bread-100 h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={app.image} 
                      alt={app.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="font-serif text-xl font-medium mb-2">{app.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{app.description}</p>
                    <Button 
                      className="mt-auto bg-bread-800 hover:bg-bread-900 text-white"
                      asChild
                    >
                      {app.isExternalLink ? (
                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          Open App
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      ) : (
                        <Link to={app.link} className="flex items-center">
                          Open App
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call-to-Action */}
      <section 
        ref={(el) => sectionRefs.current[1] = el}
        className="py-20 bg-bread-50/50 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Smartphone className="h-16 w-16 mx-auto text-bread-800 mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Need a Custom Baking App?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Have an idea for a baking calculator or tool that would enhance your baking process? We can help bring your vision to life with a custom digital solution tailored to your specific needs.
            </p>
            <Button 
              size="lg" 
              className="bg-bread-800 hover:bg-bread-900 text-white"
              asChild
            >
              <Link to="/contact">
                Contact Us About Custom Apps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AppStore;
