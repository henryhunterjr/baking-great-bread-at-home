
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard, { Book } from './BookCard';

interface BooksSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const BooksSection: React.FC<BooksSectionProps> = ({ sectionRef }) => {
  const books: Book[] = [
    {
      id: 1,
      title: "Bread: A Journey Through History, Science, Art, and Community",
      image: "/lovable-uploads/c9a9c9a9-c9a9-c9a9-c9a9-c9a9c9a9c9a9.png",
      description: "Explore the cultural and scientific history of bread through the ages.",
      link: "https://amzn.to/3znnSrA",
      isExternalLink: true
    },
    {
      id: 2,
      title: "Vitale Sourdough Mastery",
      image: "/lovable-uploads/c8a8c8a8-c8a8-c8a8-c8a8-c8a8c8a8c8a8.png",
      description: "Master the art of sourdough with this comprehensive guide.",
      link: "https://adobe.ly/3K4DVwG",
      isExternalLink: true
    },
    {
      id: 3,
      title: "Yeast Water Handbook",
      image: "/lovable-uploads/c7a7c7a7-c7a7-c7a7-c7a7-c7a7c7a7c7a7.png",
      description: "Explore the world of yeast water fermentation with this detailed handbook.",
      link: "https://designrr.page/?id=459955&token=101509510&h=4420",
      isExternalLink: true
    },
    {
      id: 4,
      title: "The Watcher's Descent",
      image: "/lovable-uploads/c6a6c6a6-c6a6-c6a6-c6a6-c6a6c6a6c6a6.png",
      description: "Echoes of Giants and Forgotten Truths - Henry's fiction work.",
      link: "https://amzn.to/3Wfj6Fj",
      isExternalLink: true
    },
    {
      id: 5,
      title: "Sourdough for the Rest of Us",
      image: "/lovable-uploads/2c5fee3e-f4a9-4a25-8bbd-c6acc7145890.png",
      description: "A free guide to get you started with sourdough baking.",
      link: "https://bit.ly/3XjRKP3",
      isExternalLink: true
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Books & Guides</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive resources to help you master the art and science of bread baking at any level.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {books.slice(0, 3).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
            {books.slice(3, 5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 hover:bg-bread-50"
              asChild
            >
              <a href="http://bakinggreatbread.blog" target="_blank" rel="noopener noreferrer">
                Visit Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;
