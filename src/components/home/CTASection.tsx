import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const CTASection: React.FC<CTASectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bread-800 rounded-2xl p-8 md:p-12 lg:p-16 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">Ready to Start Your Bread Journey?</h2>
            <p className="text-bread-100 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of passionate home bakers and get access to exclusive recipes, tips, and monthly challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-bread-800 hover:bg-bread-100"
                asChild
              >
                <Link to="/community">
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-bread-100 text-white hover:bg-bread-700"
                asChild
              >
                <Link to="/challenges">
                  View Baking Challenges
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
