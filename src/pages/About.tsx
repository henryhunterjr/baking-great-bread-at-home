
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb / back navigation */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" className="group flex items-center bg-bread-700 text-white hover:bg-bread-800 transition-colors" asChild>
                <Link to="/" aria-label="Back to Home">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            {/* Page heading */}
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-8">Henry's Story</h1>
            
            {/* Image */}
            <div className="mb-10 border rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/e1081420-d617-4779-a0ae-b2d2647d1b78.png" 
                alt="Henry, bread baking instructor and community founder" 
                className="w-full h-auto object-cover mx-auto" 
                loading="lazy"
                width="1200"
                height="800"
              />
            </div>
            
            {/* Story content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">How It All Started</h2>
              
              <p>I never set out to become a bread baker—it all began out of necessity. As a young American soldier stationed in Germany, I was struggling to make rent until my kind landlord, Mr. Sherman, offered a deal: lower my rent if I helped out in his small bakery downstairs. I believe he saw in me not just a laborer, but someone who needed bread as much as bread needed him.</p>
              
              <p>That experience transformed survival into a calling. When my tour ended, I returned to the States, delving into radio advertising and later television with Fox and CBS. But the lessons from Mr. Sherman—the craft, the care, and the magic of bread—remained with me.</p>
              
              <h2 className="font-serif text-2xl md:text-3xl font-medium mt-8 mb-4">Rediscovering My Passion</h2>
              
              <p>Baking resumed as a fun hobby until I found myself with more bread than I could possibly eat. My kids then nudged me to sell at farmers markets. With a makeshift bakery and a growing customer base, I was on the brink of going all in—until COVID shut everything down.</p>
              
              <p>Determined not to let my customers down, I launched a Saturday morning bake-along and started the Facebook group <strong>Baking Great Bread at Home</strong>, with a little help from my daughter, Payton. In just a few weeks, our community blossomed with 300 members and live sessions drawing in dozens of viewers. We even celebrated our success with a round of sushi!</p>
              
              <h2 className="font-serif text-2xl md:text-3xl font-medium mt-8 mb-4">Building a Community</h2>
              
              <p>Today, what began as a simple need has grown into a vibrant community of passionate bakers. Here, we share recipes, techniques, and the joy of creating something with our own hands. I've learned that bread is much more than just flour, water, salt, and yeast—it's a testament to tradition, patience, and community. Each loaf tells a story: of the hands that shape it, the ovens that bake it, and the moments we gather to share it.</p>
              
              <p>My mission is to pass on everything I've learned—from Mr. Sherman's time-honored methods to modern bread science—and help you discover the magic of baking great bread at home. Whether you're a novice or a seasoned baker, there's always something new to explore and someone to share your journey with.</p>
              
              <h2 className="font-serif text-2xl md:text-3xl font-medium mt-8 mb-4">Thank You for Joining the Journey</h2>
              
              <p>Thank you for being part of this incredible journey. I can't wait to see what you bake next. Join our community, share your story, and let's make bread together.</p>
              
              {/* Henry's Signature */}
              <div className="flex justify-end mt-10 mb-4">
                <img 
                  src="/lovable-uploads/8f0a3cc3-7574-4a47-854c-9690df491ed5.png" 
                  alt="Henry M. Hunter Jr. signature" 
                  className="h-24 w-auto" 
                  loading="lazy"
                  width="240"
                  height="96"
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
