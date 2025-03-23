
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTAContent = () => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">Ready to Start Your Bread Journey?</h2>
      <p className="text-bread-100 text-lg mb-8 max-w-2xl mx-auto">
        Join me in my community of passionate home bakers and get access to exclusive recipes, tips, and monthly challenges.
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
          <a href="https://bakinggreatbread.blog/https-bakinggreatbread-blog-subscribe/" target="_blank" rel="noopener noreferrer">
            Subscribe to our Blog
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default CTAContent;
