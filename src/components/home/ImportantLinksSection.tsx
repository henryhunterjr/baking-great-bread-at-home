
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, CalendarCheck, BookOpen, Utensils, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImportantLinksSectionProps {
  ref?: React.RefObject<HTMLElement>;
}

const ImportantLinksSection = forwardRef<HTMLElement, ImportantLinksSectionProps>((props, ref) => {
  const isMobile = useIsMobile();
  
  const importantLinks = [
    {
      title: "Testimonials",
      description: "See what others are saying about our bread baking techniques",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/blog?category=testimonials",
      color: "bg-bread-100 dark:bg-bread-900/60"
    },
    {
      title: "Christmas Special",
      description: "Explore our holiday bread recipes and traditions",
      icon: <CalendarCheck className="h-6 w-6" />,
      path: "/blog?category=christmas",
      color: "bg-bread-50 dark:bg-bread-900/40"
    },
    {
      title: "Baker's Bench",
      description: "Tutorials and resources to improve your skills",
      icon: <BookOpen className="h-6 w-6" />,
      path: "/care-center",
      color: "bg-bread-50 dark:bg-bread-900/40"
    },
    {
      title: "Card to Kitchen",
      description: "Transform recipe cards into delicious homemade bread",
      icon: <Utensils className="h-6 w-6" />,
      path: "/recipe-converter",
      color: "bg-bread-100 dark:bg-bread-900/60"
    }
  ];

  return (
    <section ref={ref} className="py-10 bg-white dark:bg-bread-950/20 opacity-0">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-medium mb-6 text-center">
          Essential Resources
        </h2>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 md:grid-cols-4 gap-6'} mt-6`}>
          {importantLinks.map((link, index) => (
            <Link 
              to={link.path} 
              key={index}
              className="block transform transition duration-300 hover:-translate-y-1"
            >
              <Card className={`h-full ${link.color} border-bread-200 dark:border-bread-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <div className="mr-3 text-bread-700 dark:text-bread-300">
                      {link.icon}
                    </div>
                    <h3 className="font-medium text-lg text-bread-800 dark:text-white">
                      {link.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex-grow">
                    {link.description}
                  </p>
                  <div className="flex items-center text-bread-600 dark:text-bread-400 text-sm font-medium mt-auto">
                    <span>Explore</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

ImportantLinksSection.displayName = 'ImportantLinksSection';

export default ImportantLinksSection;
