
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const CTASection: React.FC<CTASectionProps> = ({ sectionRef }) => {
  return (
    <section 
      ref={sectionRef}
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
            <div className="flex flex-wrap gap-4">
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
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/challenges">
                  Browse Past Challenges
                  <ArrowRight className="ml-2 h-4 w-4" />
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
