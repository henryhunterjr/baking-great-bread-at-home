
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-8 text-bread-800 dark:text-white">About Henry</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-1">
                <img 
                  src="/lovable-uploads/e08c08a0-e721-449e-b524-01fa739a37e5.png" 
                  alt="Henry smiling in chef whites and black hat" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-bread-800 dark:text-white">The Baker's Journey</h2>
                <p className="text-muted-foreground dark:text-gray-300">
                  Hi, I'm Henry. I didn't set out to become a bread baker. It started with a need, rent money, and a kind old baker named Mr. Sherman. I was stationed in Germany, just a young American soldier trying to stay afloat. Mr. Sherman was my landlord, a stout, spirited man who ran a small bakery downstairs. One day, he offered to lower my rent if I'd lend a hand in his shop. I think he saw more than just free labor, I think he saw someone who needed bread as much as bread needed him.
                </p>
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-bread-800 dark:text-white">From Military to Marketing to Mixing Dough</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                What began as survival turned into a calling. When my tour of duty in Germany ended, I came back to the States and started working in radio advertising and marketing. I eventually moved into television, first with Fox, and later retired from CBS. But the lessons Mr. Sherman taught me never left.
              </p>
              <p className="text-muted-foreground dark:text-gray-300">
                When I started baking again, it was just for fun. But like most of you know, once you get going, the bread starts piling up—your freezer's full and there's more than you can eat. That's when my kids suggested I try selling at farmers markets. It went better than expected. I had a solid customer base and was baking from a small, makeshift bakery. Just as I was about to go all in, sign the lease, get the insurance, our governor shut the state down for COVID.
              </p>
            </div>
            
            <div className="space-y-6 mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-bread-800 dark:text-white">Building a Community During Lockdown</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                After a week or two of doing nothing, I decided to give my customers something to do. I launched a Saturday morning bake-along and started a Facebook group called <strong>Baking Great Bread at Home</strong>, with help from my daughter Payton. Within a few weeks, we had 300 members and 13 people watching us live. We were so excited, we celebrated with sushi. Look at us now.
              </p>
              <p className="text-muted-foreground dark:text-gray-300">
                Today, our community has grown beyond what I could have imagined. What started as a way to help my customers during lockdown has become a vibrant community of home bakers from all over the world. We share recipes, tips, and the joy of creating beautiful bread with our own hands.
              </p>
            </div>
            
            <div className="space-y-6 mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-bread-800 dark:text-white">My Baking Philosophy</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                I believe that great bread doesn't need to be complicated. With the right techniques, quality ingredients, and a bit of patience, anyone can create bakery-quality bread at home. My goal is to demystify the art of bread making and make it accessible to everyone, regardless of experience level.
              </p>
              <p className="text-muted-foreground dark:text-gray-300">
                Through my books, tools, monthly challenges, and this online community, I hope to inspire you to roll up your sleeves and experience the satisfaction of creating something truly special with your own hands.
              </p>
            </div>
            
            <div className="flex justify-center mt-12">
              <Button asChild className="bg-bread-800 hover:bg-bread-900 text-white">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
