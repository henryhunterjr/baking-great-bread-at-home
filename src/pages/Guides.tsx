
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Book, FileText } from 'lucide-react';

// Sample guides data
const guidesData = [
  {
    id: 1,
    title: "Sourdough Starter Guide",
    description: "How to create and maintain your sourdough starter for perfect bread every time.",
    image: "https://images.unsplash.com/photo-1600453265914-0bfec7551fbd?q=80&w=400&auto=format&fit=crop",
    category: "Beginner",
    readTime: "10 min"
  },
  {
    id: 2,
    title: "Understanding Hydration Levels",
    description: "Learn how different hydration levels affect your bread and how to work with them.",
    image: "https://images.unsplash.com/photo-1568599965972-8a181a563621?q=80&w=400&auto=format&fit=crop",
    category: "Intermediate",
    readTime: "15 min"
  },
  {
    id: 3,
    title: "Bread Shaping Techniques",
    description: "Master essential shaping techniques from basic boules to complex braids.",
    image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5?q=80&w=400&auto=format&fit=crop",
    category: "All Levels",
    readTime: "20 min"
  },
  {
    id: 4,
    title: "Troubleshooting Common Bread Problems",
    description: "Solutions for dense crumb, poor rise, and other common baking issues.",
    image: "https://images.unsplash.com/photo-1559736322-525b756431cd?q=80&w=400&auto=format&fit=crop",
    category: "All Levels",
    readTime: "25 min"
  }
];

const Guides: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        <h1 className="text-3xl font-serif font-bold mb-2">Bread Baking Guides</h1>
        <p className="text-muted-foreground mb-8">
          Learn essential techniques and troubleshoot common problems with our comprehensive baking guides.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidesData.map((guide) => (
            <Card key={guide.id} className="overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-serif">{guide.title}</CardTitle>
                </div>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                <Button variant="outline" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Guide
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Guides;
