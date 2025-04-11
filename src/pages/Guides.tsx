
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecipeConverterNav from '@/components/recipe-converter/RecipeConverterNav';
import { HelpButton } from '@/components/onboarding';

const Guides = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <RecipeConverterNav />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Bread Baking Guides</h1>
            <p className="text-xl text-muted-foreground">
              Master the art of bread baking with our comprehensive guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80" 
                  alt="Sourdough Starter Guide" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-2">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="text-sm">Beginner's Guide</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">Creating Your First Sourdough Starter</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to create and maintain a healthy sourdough starter from scratch with this step-by-step guide.
                </p>
                <Button asChild variant="default">
                  <Link to="/guides/sourdough-starter">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80" 
                  alt="Bread Scoring Guide" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-2">
                  <Book className="h-4 w-4 mr-2" />
                  <span className="text-sm">Technique Guide</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">The Art of Bread Scoring</h3>
                <p className="text-muted-foreground mb-4">
                  Discover the secrets to beautiful bread scoring patterns and techniques that will elevate your bread's appearance.
                </p>
                <Button asChild variant="default">
                  <Link to="/guides/bread-scoring">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1594086385051-a72d28c7b99a?w=800&auto=format&fit=crop&q=80" 
                  alt="Hydration Guide" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-2">
                  <Coffee className="h-4 w-4 mr-2" />
                  <span className="text-sm">Master Class</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">Understanding Dough Hydration</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how different hydration levels affect your bread and how to master high-hydration doughs.
                </p>
                <Button asChild variant="default">
                  <Link to="/guides/dough-hydration">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-muted">
                <img 
                  src="/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png" 
                  alt="Recipe Conversion Guide" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-2">
                  <Book className="h-4 w-4 mr-2" />
                  <span className="text-sm">How-To Guide</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">Recipe Conversion Mastery</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to convert any recipe to bakers' percentages and adapt recipes to your needs.
                </p>
                <Button asChild variant="default">
                  <Link to="/recipe-converter">
                    Try Recipe Converter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/recipes">
                Browse Our Recipes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Help Button for easy tour access */}
      <div className="fixed top-20 right-5 z-30">
        <HelpButton className="bg-background/50 backdrop-blur-sm hover:bg-background/80" />
      </div>
      
      <Footer />
    </div>
  );
};

export default Guides;
