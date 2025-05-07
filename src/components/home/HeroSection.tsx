
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#1B1B1B] pt-16 md:pt-20 lg:pt-24">
      <div className="container relative z-10 py-12 md:py-16 lg:py-24">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="order-2 md:order-1 flex flex-col items-start">
            <div className="bg-bread-700/80 text-white px-4 py-2 rounded-full mb-8">
              ARTISANAL BAKING
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Master the Art of{" "}
              <span className="text-bread-500">Baking Great Bread</span>
              <br className="hidden sm:block" />
              at Home
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-lg">
              Join me in my community of passionate home bakers and discover the simple joy of creating artisanal bread with your own hands.
            </p>
            <div className="mt-8 space-x-4 flex">
              <Button asChild size="lg" className="bg-[#e2d5c3] text-[#1B1B1B] hover:bg-[#d0c0a9]">
                <Link to="/recipes" className="flex items-center">
                  Explore Recipes <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-bread-500 text-bread-300 hover:bg-bread-800/30">
                <Link to="/community">
                  Join Community
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto order-1 md:order-2 max-w-xl lg:max-w-2xl">
            <div className="relative">
              <img
                src="/lovable-uploads/bf63b3f9-60b6-441b-a0fb-fa932d3b2c6b.png"
                alt="Sliced artisan bread showing perfect crumb structure"
                width={960}
                height={640}
                className="h-auto w-full rounded-lg shadow-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-xs text-white text-center rounded-b-lg">
                Photo of beautiful bread crumb structure
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-background to-[#1B1B1B]/70 opacity-60 z-0"></div>
    </section>
  );
};

export default HeroSection;
