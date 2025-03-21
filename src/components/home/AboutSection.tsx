
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 opacity-0">
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
  );
};

export default AboutSection;
