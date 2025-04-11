import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  HelpCircle,
  LifeBuoy,
  BookOpen,
  Lightbulb,
  MapPin,
  Search,
  FileText,
  Edit,
  Save,
  MessageSquare,
  RefreshCcw,
  Bookmark
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface HelpSectionProps {
  title: string;
  children: React.ReactNode;
}

const HelpSection: React.FC<HelpSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

interface HelpItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HelpItem: React.FC<HelpItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const HelpCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('guide');
  const { setShowTour, setCurrentStep, setHasCompletedTour } = useOnboarding();

  const startTour = () => {
    setIsOpen(false);
    setCurrentStep(0);
    setHasCompletedTour(false);
    setShowTour(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed bottom-6 left-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg z-20"
              onClick={() => setIsOpen(true)}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help Center</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help Center</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              Help Center
            </DialogTitle>
            <DialogDescription>
              Find answers and get help with using the app
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="guide" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Guide</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                <span>Tips</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <div className="space-y-6">
                <HelpSection title="Recipe Converter">
                  <HelpItem
                    icon={<FileText size={16} />}
                    title="Converting Recipes"
                    description="Paste recipe text, upload PDFs, or take photos. The app will convert them to a structured format."
                  />
                  <HelpItem
                    icon={<Edit size={16} />}
                    title="Editing Recipes"
                    description="Click on any field to edit ingredients, instructions, or other recipe details."
                  />
                  <HelpItem
                    icon={<Save size={16} />}
                    title="Saving Recipes"
                    description="Save recipes to your library to access them anytime you need them."
                  />
                </HelpSection>

                <HelpSection title="Bread Assistant">
                  <HelpItem
                    icon={<MessageSquare size={16} />}
                    title="Ask Questions"
                    description="Get expert answers to all your bread baking questions and troubleshooting help."
                  />
                  <HelpItem
                    icon={<RefreshCcw size={16} />}
                    title="Recipe Modifications"
                    description="Ask for help with substitutions, scaling, or adapting recipes for different needs."
                  />
                </HelpSection>

                <HelpSection title="Recipe Library">
                  <HelpItem
                    icon={<Search size={16} />}
                    title="Finding Recipes"
                    description="Use search or browse your saved recipes by type, tags, or categories."
                  />
                  <HelpItem
                    icon={<Bookmark size={16} />}
                    title="Favorites"
                    description="Mark recipes as favorites to easily find your most-used recipes."
                  />
                </HelpSection>

                <Button
                  onClick={startTour}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Restart Interactive Tour
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tips">
              <div className="space-y-4">
                <h3 className="font-medium">Quick Tips</h3>
                <ul className="space-y-3 list-disc pl-5">
                  <li className="text-sm">
                    <span className="font-medium">PDF Uploads:</span> For best results, use PDFs with selectable text rather than scanned images.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">AI Assistant:</span> Ask specific questions about techniques, ingredients, or troubleshooting for the best answers.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Text Input:</span> You can paste recipes from websites, cookbooks, or any text source directly.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Ingredients:</span> Use the + button to add new ingredients. Measurements will be automatically formatted.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Offline Access:</span> Your saved recipes are accessible even when you're offline.
                  </li>
                </ul>

                <div className="mt-6 p-3 bg-muted rounded-md">
                  <h4 className="font-medium text-sm mb-1">Need more help?</h4>
                  <p className="text-xs text-muted-foreground">
                    Try the Bread Assistant feature for personalized help with specific questions or recipe issues.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpCenter;
