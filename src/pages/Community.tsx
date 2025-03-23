
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Community = () => {
  const FACEBOOK_GROUP_LINK = 'https://www.facebook.com/groups/1082865755403754';
  
  return (
    <div className="min-h-screen bg-bread-50 dark:bg-bread-900">
      <Navbar />
      
      {/* Hero Section with improved text legibility */}
      <div className="relative w-full">
        <div className="relative w-full h-[550px] overflow-hidden">
          <img 
            src="/lovable-uploads/786795e9-6433-4bbd-b76c-f6bde36e7e30.png" 
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

      {/* Community Benefits Section with improved contrast and hover animations */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-bread-900 dark:text-white mb-4">Why Join Our Community?</h2>
          <p className="text-bread-700 dark:text-bread-200 max-w-3xl mx-auto text-lg">
            Being part of our bread baking community comes with many benefits that will help you improve your skills and enjoy the journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-bread-800 p-8 rounded-lg shadow-sm border border-bread-100 dark:border-bread-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-700">
            <h3 className="text-2xl font-serif text-bread-800 dark:text-white mb-4">Learn Together</h3>
            <p className="text-bread-700 dark:text-bread-200">Share tips, ask questions, and learn from both beginners and experienced bakers in a supportive environment.</p>
          </div>
          
          <div className="bg-white dark:bg-bread-800 p-8 rounded-lg shadow-sm border border-bread-100 dark:border-bread-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-700">
            <h3 className="text-2xl font-serif text-bread-800 dark:text-white mb-4">Monthly Challenges</h3>
            <p className="text-bread-700 dark:text-bread-200">Participate in our monthly baking challenges to try new recipes and techniques while getting feedback from the community.</p>
          </div>
          
          <div className="bg-white dark:bg-bread-800 p-8 rounded-lg shadow-sm border border-bread-100 dark:border-bread-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-700">
            <h3 className="text-2xl font-serif text-bread-800 dark:text-white mb-4">Showcase Your Creations</h3>
            <p className="text-bread-700 dark:text-bread-200">Proud of what you've baked? Share photos of your bread and get recognized for your achievements.</p>
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
      
      {/* Testimonials Section with improved contrast and hover animations */}
      <div className="bg-bread-100 dark:bg-bread-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif text-bread-900 dark:text-white mb-12 text-center">
            What Our Community Members Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-bread-700 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-600">
              <p className="text-bread-700 dark:text-white mb-4 font-medium">
                "Thank you Henry Hunter! Your encouragement and help have been invaluable!"
              </p>
              <p className="font-bold text-bread-900 dark:text-bread-100">- Joseph Librizzi</p>
            </div>
            
            <div className="bg-white dark:bg-bread-700 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-600">
              <p className="text-bread-700 dark:text-white mb-4 font-medium">
                "Happy Anniversary!! Your dedication to this community is inspiring! Here's to many more years of baking and connection."
              </p>
              <p className="font-bold text-bread-900 dark:text-bread-100">- Debbie Eckstein</p>
            </div>
            
            <div className="bg-white dark:bg-bread-700 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-600">
              <p className="text-bread-700 dark:text-white mb-4 font-medium">
                "Wow, 5 years! I remember your first Saturday teaching us how to bake bread. You mentioned at one point that you thought if you got 25 followers you'd be thrilled! 😊 So, what do you think now, Henry?"
              </p>
              <p className="font-bold text-bread-900 dark:text-bread-100">- Nikki Carriere</p>
            </div>
            
            <div className="bg-white dark:bg-bread-700 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-600">
              <p className="text-bread-700 dark:text-white mb-4 font-medium">
                "I have learned so much from this community. Your leadership and expertise along with the kindness of it members have turned this into a welcoming family."
              </p>
              <p className="font-bold text-bread-900 dark:text-bread-100">- Christina Smith</p>
            </div>
            
            <div className="bg-white dark:bg-bread-700 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-600">
              <p className="text-bread-700 dark:text-white mb-4 font-medium">
                "Congratulations 🎉 Thank you all for your hard work to create this wonderful group! It's been such a pleasure to be part of this terrific community. Always professional, friendly and kind and so very empathetic and supportive- it's much appreciated."
              </p>
              <p className="font-bold text-bread-900 dark:text-bread-100">- Imke Borawski</p>
            </div>
            
            <div className="bg-white dark:bg-bread-700 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-bread-50 dark:hover:bg-bread-600">
              <p className="text-bread-700 dark:text-white mb-4 font-medium">
                "In contrast to other groups, this Community created by Henry Hunter feels like a family to me. I'm no longer afraid of being kicked out, as Henry is always kind enough to guide me on the group's rules. His name is well-known among my family and friends, and I feel incredibly fortunate to be part of this community. I want to take this opportunity to thank you all. Congratulations and Happy Anniversary!✨💛"
              </p>
              <p className="font-bold text-bread-900 dark:text-bread-100">- Aldrina Yun</p>
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
