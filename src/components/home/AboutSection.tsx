
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface AboutSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  sectionRef
}) => {
  return <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 dark:bg-bread-900 opacity-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title">Meet Henry</h2>
          <p className="section-subtitle dark:text-gray-300">
            Baker, author, and community builder.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Meet Henry Section */}
          <div className="mb-8 text-left">
            <p className="text-muted-foreground dark:text-gray-300 mb-4 font-normal">Hi, I'm Henry. I didn't set out to become a bread baker. It started with a need, rent money, and a kind old baker named Mr. Sherman. I was stationed in Germany, just a young American soldier trying to stay afloat. Mr. Sherman was my landlord, a stout, spirited man who ran a small bakery downstairs. One day, he offered to lower my rent if I'd lend a hand in his shop. I think he saw more than just free labor, I think he saw someone who needed bread as much as bread needed him.</p>
          </div>
          
          {/* Grid for Image and Passion for Perfect Loaves */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col">
              <div className="hero-image-container mb-6">
                <img src="/lovable-uploads/e08c08a0-e721-449e-b524-01fa739a37e5.png" alt="Henry smiling in chef whites and black hat with bread dough" className="hero-image rounded-lg" />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-serif text-2xl md:text-3xl font-medium mb-4">A Passion for Perfect Loaves</h3>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                What began as survival turned into a calling. When my tour of duty in Germany ended, I came back to the States and started working in radio advertising and marketing. I eventually moved into television, first with Fox, and later retired from CBS. But the lessons Mr. Sherman taught me never left.
              </p>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">When I started baking again, it was just for fun. But like most of you know, once you get going, the bread starts piling up—your freezer's full and there's more than you can eat. That's when my kids suggested I try selling at farmers markets. It went better than expected. I had a solid customer base and was baking from a small, makeshift bakery. Just as I was about to go all in, sign the lease, get the insurance, our governor shut the state down for COVID.</p>
              <p className="text-muted-foreground dark:text-gray-300 mb-6">
                After a week or two of doing nothing, I decided to give my customers something to do. I launched a Saturday morning bake-along and started a Facebook group called <strong>Baking Great Bread at Home</strong>, with help from my daughter Payton. Within a few weeks, we had 300 members and 13 people watching us live. We were so excited, we celebrated with sushi. Look at us now.
              </p>
              
              {/* Henry's Signature */}
              <div className="flex justify-end mt-6 mb-4">
                <img 
                  src="/lovable-uploads/8f0a3cc3-7574-4a47-854c-9690df491ed5.png" 
                  alt="Henry M. Hunter Jr. signature" 
                  className="h-24 w-auto" 
                />
              </div>
            </div>
          </div>
          
          {/* Button centered below everything */}
          <div className="flex justify-center mt-10">
            <Button variant="outline" className="border-bread-200 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800" asChild>
              <Link to="/about">
                Read Henry's Full Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

export default AboutSection;
