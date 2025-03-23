
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb / back navigation */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" className="group flex items-center" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            {/* Page heading */}
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-8">Henry's Story</h1>
            
            {/* Image */}
            <div className="mb-10 border rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/b7572677-0e3f-4952-b3a2-114cc5726d98.png" 
                alt="Henry in chef whites" 
                className="w-full h-auto object-cover mx-auto"
              />
            </div>
            
            {/* Story content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">How It All Started</h2>
              
              <p>I didn't set out to become a bread baker. It started with a need, rent money, and a kind old baker named Mr. Sherman. I was stationed in Germany, just a young American soldier trying to stay afloat. Mr. Sherman was my landlord, a stout, spirited man who ran a small bakery downstairs. One day, he offered to lower my rent if I'd lend a hand in his shop. I think he saw more than just free labor, I think he saw someone who needed bread as much as bread needed him.</p>
              
              <p>What began as survival turned into a calling. When my tour of duty in Germany ended, I came back to the States and started working in radio advertising and marketing. I eventually moved into television, first with Fox, and later retired from CBS. But the lessons Mr. Sherman taught me never left.</p>
              
              <h2 className="font-serif text-2xl md:text-3xl font-medium mt-8 mb-4">Rediscovering My Passion</h2>
              
              <p>When I started baking again, it was just for fun. But like most bakers know, once you get going, the bread starts piling up—your freezer's full and there's more than you can eat. That's when my kids suggested I try selling at farmers markets. It went better than expected. I had a solid customer base and was baking from a small, makeshift bakery. Just as I was about to go all in, sign the lease, get the insurance, our governor shut the state down for COVID.</p>
              
              <p>After a week or two of doing nothing, I decided to give my customers something to do. I launched a Saturday morning bake-along and started a Facebook group called <strong>Baking Great Bread at Home</strong>, with help from my daughter Payton. Within a few weeks, we had 300 members and 13 people watching us live. We were so excited, we celebrated with sushi.</p>
              
              <h2 className="font-serif text-2xl md:text-3xl font-medium mt-8 mb-4">Building A Community</h2>
              
              <p>Fast forward to today, and our community has grown beyond anything I could have imagined. What started as a necessity has become a passion project that connects bakers from all walks of life. We share recipes, techniques, and the simple joy that comes from creating something with our hands.</p>
              
              <p>I've learned that bread is more than just flour, water, salt, and yeast. It's about tradition, patience, and community. Every loaf tells a story—of the hands that shaped it, the oven that baked it, and the people who gather around to break it.</p>
              
              <p>My mission now is to share everything I've learned—from Mr. Sherman's old-world techniques to modern bread science—and help you discover the magic of baking great bread at home. Whether you're just starting out or you've been baking for years, there's always something new to learn and someone new to share it with.</p>
              
              <p>Thank you for being part of this journey. I can't wait to see what you bake next.</p>
              
              {/* Henry's Signature */}
              <div className="flex justify-end mt-10 mb-4">
                <img 
                  src="/lovable-uploads/8f0a3cc3-7574-4a47-854c-9690df491ed5.png" 
                  alt="Henry M. Hunter Jr. signature" 
                  className="h-24 w-auto" 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
