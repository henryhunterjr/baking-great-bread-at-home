import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
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
  
  // Featured books with corrected cover images
  const featuredBooks = [
    {
      id: 1,
      title: "Sourdough for the Rest of Us",
      image: "/lovable-uploads/e5ad348d-4545-4155-b74b-3ab6249ee711.png",
      description: "A beginner-friendly guide to mastering sourdough bread with simple techniques and clear instructions.",
      link: "https://hunter53.gumroad.com/l/tejdc",
      isExternalLink: true
    },
    {
      id: 2,
      title: "Bread: A Journey Through History, Science, Art, and Community",
      image: "/lovable-uploads/2c5fee3e-f4a9-4a25-8bbd-c6acc7145890.png",
      description: "An exploration of bread's cultural significance through the lenses of history, science, art, and community building.",
      link: "https://a.co/d/4UCIwap",
      isExternalLink: true
    },
    {
      id: 3,
      title: "Vitale Sourdough Mastery",
      image: "/lovable-uploads/646e5f8d-0a55-476c-9e3e-3b2db6e789bb.png", 
      description: "Unlock the secrets of perfect sourdough with this comprehensive guide to flavor development.",
      link: "https://a.co/d/1HBuy64",
      isExternalLink: true
    },
    {
      id: 4,
      title: "From Oven to Market",
      image: "/lovable-uploads/c9c54d1b-23da-4ca7-b7b0-73fa9e8c613e.png", 
      description: "Everything you need to know about selling bread at farmers' markets and beyond.",
      link: "https://a.co/d/9ebJdSZ",
      isExternalLink: true
    },
    {
      id: 5,
      title: "The Yeast Water Handbook",
      image: "/lovable-uploads/fd62f06c-1337-421a-9a9b-7a4c21ec1182.png",
      description: "A comprehensive guide to creating and using natural yeast waters for unique bread flavors.",
      link: "https://a.co/d/4muwBEV",
      isExternalLink: true
    }
  ];
  
  // Featured tools
  const featuredTools = [
    {
      id: 1,
      title: "Brød & Taylor Bread Proofer",
      image: "https://images.unsplash.com/photo-1609501676725-7155fb064675?q=80&w=1000&auto=format&fit=crop",
      description: "Create the perfect environment for your dough with precise temperature control.",
      link: "/tools"
    },
    {
      id: 2,
      title: "SourHouse Starter Kit",
      image: "https://images.unsplash.com/photo-1635321313157-5be9fde3fcbb?q=80&w=1000&auto=format&fit=crop",
      description: "Everything you need to begin your sourdough journey with confidence.",
      link: "/tools"
    },
    {
      id: 3,
      title: "ModKitchn Bread Lame",
      image: "https://images.unsplash.com/photo-1603569283843-5223b2f550ff?q=80&w=1000&auto=format&fit=crop",
      description: "Precision scoring tool for creating beautiful patterns on your artisan loaves.",
      link: "/tools"
    }
  ];
  
  // Latest blog posts
  const latestBlogs = [
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="pt-32 pb-20 md:pt-40 md:pb-28 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-bread-200 rounded-full text-bread-800 bg-bread-50">
                  Artisanal Baking
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                  Master the Art of <br />
                  <span className="text-bread-800">Baking Great Bread</span>
                  <br /> at Home
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  Join Henry's community of passionate home bakers and discover the simple joy of creating artisanal bread with your own hands.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-bread-800 hover:bg-bread-900 text-white"
                  >
                    Explore Recipes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-bread-200 text-bread-800 hover:bg-bread-50"
                  >
                    Join Community
                  </Button>
                </div>
              </div>
              <div className="hero-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1603362219626-9432cfabe184?q=80&w=1000&auto=format&fit=crop" 
                  alt="Freshly baked artisan bread" 
                  className="hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section 
        ref={(el) => sectionRefs.current[0] = el} 
        className="py-20 bg-bread-50/50 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title">Meet Henry</h2>
            <p className="section-subtitle">
              Baker, author, and passionate advocate for the home baking community. Henry's journey from amateur enthusiast to bread expert spans over a decade of experimentation, learning, and sharing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto">
            <div className="hero-image-container">
              <img 
                src="/lovable-uploads/e08c08a0-e721-449e-b524-01fa739a37e5.png" 
                alt="Henry smiling in chef whites and black hat with bread dough" 
                className="hero-image rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h3 className="font-serif text-2xl md:text-3xl font-medium">A Passion for Perfect Loaves</h3>
              <p className="text-muted-foreground">
                What began as a weekend hobby quickly evolved into a lifelong passion. After years of perfecting recipes and techniques, Henry now dedicates his time to helping others discover the joy and satisfaction of creating beautiful, delicious bread at home.
              </p>
              <p className="text-muted-foreground">
                Through books, online courses, and an active community, Henry has helped thousands of bakers overcome common challenges and achieve results they never thought possible in their own kitchens.
              </p>
              <div className="mt-6">
                <img 
                  src="/lovable-uploads/4e1336b3-7d4d-4a63-a658-6fbb456160fd.png" 
                  alt="Henry M. Hunter Jr. signature with whisk icon" 
                  className="h-16 w-auto"
                />
              </div>
              <Button 
                variant="outline" 
                className="border-bread-200 text-bread-800 hover:bg-bread-50 mt-4"
                asChild
              >
                <Link to="/about">
                  Learn More About Henry
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Books */}
      <section 
        ref={(el) => sectionRefs.current[1] = el}
        className="py-20 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title">Books & Guides</h2>
            <p className="section-subtitle">
              Comprehensive resources to help you master every aspect of bread making, from basic techniques to advanced artisanal methods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book, index) => (
              <Card key={book.id} className="overflow-hidden card-hover border-bread-100">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-2">{book.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{book.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-bread-200 text-bread-800 hover:bg-bread-50"
                    asChild
                  >
                    {book.isExternalLink ? (
                      <a href={book.link} target="_blank" rel="noopener noreferrer">
                        View Book
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </a>
                    ) : (
                      <Link to={book.link}>
                        View Book
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="ghost" 
              className="text-bread-800 hover:bg-bread-50"
              asChild
            >
              <Link to="/books">
                View All Books & Guides
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Tools */}
      <section 
        ref={(el) => sectionRefs.current[2] = el}
        className="py-20 bg-bread-50/50 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title">Recommended Tools</h2>
            <p className="section-subtitle">
              Quality equipment makes all the difference. Here are my personally tested recommendations to elevate your baking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden card-hover border-bread-100 glass-card">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
                  <Button 
                    size="sm" 
                    className="w-full bg-bread-800 hover:bg-bread-900 text-white"
                    asChild
                  >
                    <Link to={tool.link}>
                      Shop Now
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="ghost" 
              className="text-bread-800 hover:bg-bread-50"
              asChild
            >
              <Link to="/tools">
                Browse All Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={(el) => sectionRefs.current[3] = el}
        className="py-20 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-bread-800/90 to-bread-950/80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1511629036492-6c07153d3e83?q=80&w=1000&auto=format&fit=crop" 
              alt="Baking workshop" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 py-16 px-8 md:p-16 max-w-3xl">
              <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-white/20 rounded-full text-white/90 bg-white/10 backdrop-blur-sm mb-6">
                Limited Availability
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-4">
                Join Our Exclusive Baking Challenges
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Participate in our monthly challenges, connect with fellow bakers, and win amazing prizes including premium baking tools and personal coaching sessions.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-bread-900 hover:bg-cream-100"
                asChild
              >
                <Link to="/challenges">
                  Join Current Challenge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Blog Posts */}
      <section 
        ref={(el) => sectionRefs.current[4] = el}
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
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
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
      
      {/* App Promo Section */}
      <section 
        ref={(el) => sectionRefs.current[5] = el}
        className="py-20 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-bread-50 to-cream-100 border border-bread-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12 lg:p-16">
                <img 
                  src="/lovable-uploads/57ca7c7a-c958-4126-b81f-4bbf30028a7f.png" 
                  alt="Baking Great Bread at Home Logo" 
                  className="w-40 h-auto mb-6"
                />
                <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                  Crust & Crumb App
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Our intuitive baking calculator helps you scale recipes, convert measurements, and adjust hydration levels with ease.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="rounded-full bg-bread-100 p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-bread-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Precise recipe scaling for any batch size</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-bread-100 p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-bread-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Instant unit conversions between metric and imperial</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-bread-100 p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-bread-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Hydration calculator for perfect dough consistency</span>
                  </li>
                </ul>
                <Button 
                  size="lg" 
                  className="bg-bread-800 hover:bg-bread-900 text-white"
                  asChild
                >
                  <Link to="/app">
                    Download Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center p-8">
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop" 
                  alt="Crust & Crumb App" 
                  className="max-w-full h-auto rounded-xl shadow-xl animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
