
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { X, Coffee, BookOpen, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const WelcomeModal: React.FC = () => {
  const { 
    hasSeenWelcomeModal, 
    setHasSeenWelcomeModal, 
    setShowTour 
  } = useOnboarding();

  const handleClose = () => {
    setHasSeenWelcomeModal(true);
  };

  const startTour = () => {
    setHasSeenWelcomeModal(true);
    setShowTour(true);
  };

  const features = [
    {
      icon: <Coffee className="h-5 w-5 text-primary" />,
      title: 'Recipe Converter',
      description: 'Transform any recipe into a structured, easy-to-follow format.',
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: 'Recipe Library',
      description: 'Save and organize all your favorite bread recipes in one place.',
    },
    {
      icon: <Award className="h-5 w-5 text-primary" />,
      title: 'Bread Assistant',
      description: 'Get expert advice and answers to all your bread baking questions.',
    },
  ];

  return (
    <Dialog open={!hasSeenWelcomeModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Welcome to Baking Great Bread at Home</DialogTitle>
          <DialogDescription>
            Your personal bread baking companion
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-6">
            This app helps you convert, organize, and perfect your bread recipes. Take a quick tour to get started!
          </p>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between gap-3">
          <Button variant="outline" onClick={handleClose}>
            Skip Tour
          </Button>
          <Button onClick={startTour}>
            Take the Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
