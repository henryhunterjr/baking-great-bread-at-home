
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Community = () => {
  const FACEBOOK_GROUP_LINK = 'https://www.facebook.com/groups/1082865755403754';
  
  return (
    <div className="min-h-screen bg-bread-50">
      {/* Hero Section with improved text legibility */}
      <div className="relative w-full">
        <div className="relative w-full h-[550px] overflow-hidden">
          <img 
            src="/lovable-uploads/9e1512bf-af30-4ae1-a9ad-ed5a5d8cd667.png" 
            alt="Baking Great Bread at Home - Community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bread-950/60"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-bread-950/70 p-6 rounded-lg backdrop-blur-sm max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
              Join Our Bread Baking Community
            </h1>
            <p className="text-xl text-white mb-8">
              Connect with fellow bread enthusiasts, share your creations, and learn from others in our supportive Facebook group.
            </p>
            <Button 
              size="lg" 
              className="bg-bread-800 hover:bg-bread-900 text-white"
              asChild
            >
              <a href={FACEBOOK_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Join Our Facebook Group
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Community Benefits Section with improved contrast */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-bread-900 mb-4">Why Join Our Community?</h2>
          <p className="text-bread-700 max-w-3xl mx-auto text-lg">
            Being part of our bread baking community comes with many benefits that will help you improve your skills and enjoy the journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-bread-100">
            <h3 className="text-2xl font-serif text-bread-800 mb-4">Learn Together</h3>
            <p className="text-bread-700">Share tips, ask questions, and learn from both beginners and experienced bakers in a supportive environment.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-bread-100">
            <h3 className="text-2xl font-serif text-bread-800 mb-4">Monthly Challenges</h3>
            <p className="text-bread-700">Participate in our monthly baking challenges to try new recipes and techniques while getting feedback from the community.</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-bread-100">
            <h3 className="text-2xl font-serif text-bread-800 mb-4">Showcase Your Creations</h3>
            <p className="text-bread-700">Proud of what you've baked? Share photos of your bread and get recognized for your achievements.</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-bread-800 hover:bg-bread-900 text-white"
            asChild
          >
            <a href={FACEBOOK_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center">
              Join Now
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
      
      {/* Testimonials Section with improved contrast */}
      <div className="bg-bread-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif text-bread-900 mb-12 text-center">
            What Our Community Members Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="italic text-bread-700 mb-4">
                "Joining this community has transformed my bread baking. The support and knowledge sharing is incredible, and I've made friends who share my passion."
              </p>
              <p className="font-medium text-bread-900">- Sarah J.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="italic text-bread-700 mb-4">
                "As a beginner, I was intimidated at first, but everyone was so welcoming. Now I'm baking bread I never thought I could make!"
              </p>
              <p className="font-medium text-bread-900">- Michael T.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="italic text-bread-700 mb-4">
                "The monthly challenges pushed me to try new techniques and recipes. It's made bread baking even more fun and I look forward to each new challenge."
              </p>
              <p className="font-medium text-bread-900">- Emma L.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final CTA with improved contrast */}
      <div className="bg-bread-800 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 text-bread-100">
            Connect with fellow bread enthusiasts today and take your bread baking to the next level.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-bread-800"
            asChild
          >
            <a href={FACEBOOK_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center">
              Join Our Facebook Group
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;
