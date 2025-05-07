
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-muted pt-16 md:pt-20 lg:pt-24">
      <div className="container relative z-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="order-2 sm:order-1">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Bake Your Best <br className="hidden sm:block" />
              Bread Yet
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover, create, and perfect bread recipes with our easy-to-use tools.
              From sourdough to challah, we'll help you bake your best loaf yet.
            </p>
            <div className="mt-6 space-x-3">
              <Link to="/recipe-converter">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative mx-auto mt-8 max-w-3xl lg:mt-12">
            <div className="relative">
              <img
                src="/lovable-uploads/hero-bread-baking.jpg"
                alt="Fresh baked artisan bread on cooling rack"
                fetchPriority="high" 
                width={960}
                height={640}
                className="h-auto w-full rounded-lg shadow-xl"
              />
              <div className="absolute bottom-0 right-0 rounded-tl-lg bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                Photo by <a href="https://unsplash.com/@brookelark?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Brooke Lark</a> on <a href="https://unsplash.com/photos/W9OKrxqYVkI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-background to-muted opacity-60 z-0"></div>
    </section>
  );
};

export default HeroSection;
