
import React from 'react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Book, FileText } from 'lucide-react';
import MediaPageHeader from '@/components/care-center/MediaPageHeader';

// Sample guides data with updated images
const guidesData = [
  {
    id: 1,
    title: "Sourdough Starter Guide",
    description: "How to create and maintain your sourdough starter for perfect bread every time.",
    image: "https://images.unsplash.com/photo-1600453265914-0bfec7551fbd?q=80&w=800&auto=format&fit=crop",
    category: "Beginner",
    readTime: "10 min"
  },
  {
    id: 2,
    title: "Understanding Hydration Levels",
    description: "Learn how different hydration levels affect your bread and how to work with them.",
    image: "https://images.unsplash.com/photo-1568599965972-8a181a563621?q=80&w=800&auto=format&fit=crop",
    category: "Intermediate",
    readTime: "15 min"
  },
  {
    id: 3,
    title: "Bread Shaping Techniques",
    description: "Master essential shaping techniques from basic boules to complex braids.",
    image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5?q=80&w=800&auto=format&fit=crop",
    category: "All Levels",
    readTime: "20 min"
  },
  {
    id: 4,
    title: "Troubleshooting Common Bread Problems",
    description: "Solutions for dense crumb, poor rise, and other common baking issues.",
    image: "https://images.unsplash.com/photo-1559736322-525b756431cd?q=80&w=800&auto=format&fit=crop",
    category: "All Levels",
    readTime: "25 min"
  }
];

const Guides: React.FC = () => {
  useScrollToTop();

  return (
    <main className="flex-grow container max-w-6xl px-4 pt-24 pb-16 md:pt-28">
      {/* Updated header with better contrast */}
      <div className="text-center mb-16 bg-bread-800 dark:bg-bread-900 p-8 rounded-lg shadow-md">
        <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-white">
          Bread Baking Guides
        </h1>
        <p className="text-bread-100 text-lg max-w-3xl mx-auto">
          Learn essential techniques and troubleshoot common problems with our comprehensive baking guides.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guidesData.map((guide) => (
          <Card key={guide.id} className="overflow-hidden border border-bread-300 dark:border-bread-700 hover:shadow-xl transition-all duration-300">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-serif text-bread-900 dark:text-bread-50">{guide.title}</CardTitle>
              </div>
              <CardDescription className="text-bread-700 dark:text-bread-300">{guide.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm text-bread-600 dark:text-bread-400">
                <span className="flex items-center">
                  <Book className="h-4 w-4 mr-1" />
                  {guide.category}
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {guide.readTime} read
                </span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" className="w-full border-bread-500 text-bread-800 dark:text-bread-50 hover:bg-bread-100 dark:hover:bg-bread-800">
                <BookOpen className="mr-2 h-4 w-4" />
                Read Guide
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Guides;
