
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Search, BookOpen, MessageSquare, ArrowRight, Upload } from 'lucide-react';

const WelcomeModal = () => {
  const { hasSeenWelcomeModal, setHasSeenWelcomeModal, setShowTour } = useOnboarding();
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Show welcome modal if the user hasn't seen it yet
    if (!hasSeenWelcomeModal) {
      setIsOpen(true);
    }
  }, [hasSeenWelcomeModal]);
  
  const handleStartTour = () => {
    setIsOpen(false);
    setHasSeenWelcomeModal(true);
    // Add a small delay before starting the tour to ensure DOM is ready
    setTimeout(() => {
      setShowTour(true);
    }, 300);
  };
  
  const handleSkipTour = () => {
    setIsOpen(false);
    setHasSeenWelcomeModal(true);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-bread-800 to-bread-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/lovable-uploads/ab5456bd-6df2-4257-95de-65053717099f.png"
              alt="Bread illustration"
              className="w-full h-full object-cover mix-blend-overlay opacity-20"
            />
            <h2 className="text-white text-2xl font-serif absolute">
              Welcome to Bread Recipes
            </h2>
          </div>
        </div>
        
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-xl text-center">
            Discover, Convert & Create Amazing Bread Recipes
          </DialogTitle>
          <DialogDescription className="text-center">
            Let's help you get started with the key features of our app.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Search for Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Search for recipes like "challah bread" or "banana bread" by typing in the search field and pressing Enter or the search button. Try specific bread types or ingredients!
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Convert Your Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Upload recipe images, PDFs, or paste text to convert your favorite recipes into a structured format using our Recipe Converter tool.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Browse Recipe Collection</h3>
              <p className="text-sm text-muted-foreground">
                Explore our curated collection of bread recipes, filter by type, or browse through categories to find your next baking project.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Ask the Baking Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Click the glowing button in the bottom-right corner to ask questions about bread baking or get recipe help from our AI assistant.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-muted p-4 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={handleSkipTour} className="sm:mr-auto">
            Skip Tour
          </Button>
          <Button onClick={handleStartTour} className="sm:ml-auto gap-2">
            Take a Quick Tour
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
