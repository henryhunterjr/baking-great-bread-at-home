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
      title: "Sourdough Fundamentals",
      image: "/lovable-uploads/c9a9c9a9-c9a9-c9a9-c9a9-c9a9c9a9c9a9.png",
      description: "Master the basics of sourdough bread baking with this comprehensive guide.",
      link: "/books/sourdough-fundamentals",
      isExternalLink: false
    },
    {
      id: 2,
      title: "Artisan Bread at Home",
      image: "/lovable-uploads/c8a8c8a8-c8a8-c8a8-c8a8-c8a8c8a8c8a8.png",
      description: "Create bakery-quality artisan breads in your home kitchen with simple techniques.",
      link: "/books/artisan-bread",
      isExternalLink: false
    },
    {
      id: 3,
      title: "Whole Grain Baking",
      image: "/lovable-uploads/c7a7c7a7-c7a7-c7a7-c7a7-c7a7c7a7c7a7.png",
      description: "Explore the world of nutritious and flavorful whole grain breads and pastries.",
      link: "/books/whole-grain",
      isExternalLink: false
    },
    {
      id: 4,
      title: "Bread Science",
      image: "/lovable-uploads/c6a6c6a6-c6a6-c6a6-c6a6-c6a6c6a6c6a6.png",
      description: "Understand the chemistry and biology behind successful bread baking.",
      link: "https://example.com/bread-science",
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {books.map((book) => (
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
              <Link to="/books">
                View All Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;
