
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard, { Book } from './BookCard';

interface BooksSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const BooksSection: React.FC<BooksSectionProps> = ({ sectionRef }) => {
  // Featured books data
  const featuredBooks: Book[] = [
    {
      id: 1,
      title: "Sourdough for the Rest of Us",
      image: "/lovable-uploads/d1efb4dd-b9b6-48dc-ba6c-10dc3dc380d0.png",
      description: "A beginner-friendly guide to mastering sourdough bread with simple techniques and clear instructions.",
      link: "https://hunter53.gumroad.com/l/tejdc",
      isExternalLink: true
    },
    {
      id: 2,
      title: "Bread: A Journey Through History, Science, Art, and Community",
      image: "/lovable-uploads/2c5fee3e-f4a9-4a25-8bbd-c6acc7145890.png",
      description: "An exploration of bread's cultural significance through the lenses of history, science, art, and community building.",
      link: "https://a.co/d/4UCIwap",
      isExternalLink: true
    },
    {
      id: 3,
      title: "Vitale Sourdough Mastery",
      image: "/lovable-uploads/64d291fa-0087-428c-a301-3dc6730f3743.png", 
      description: "Unlock the secrets of perfect sourdough with this comprehensive guide to flavor development.",
      link: "https://a.co/d/1HBuy64",
      isExternalLink: true
    },
    {
      id: 4,
      title: "From Oven to Market",
      image: "/lovable-uploads/c9c54d1b-23da-4ca7-b7b0-73fa9e8c613e.png", 
      description: "Everything you need to know about selling bread at farmers' markets and beyond.",
      link: "https://a.co/d/9ebJdSZ",
      isExternalLink: true
    },
    {
      id: 5,
      title: "The Yeast Water Handbook",
      image: "/lovable-uploads/fd62f06c-1337-421a-9a9b-7a4c21ec1182.png",
      description: "A comprehensive guide to creating and using natural yeast waters for unique bread flavors.",
      link: "https://a.co/d/4muwBEV",
      isExternalLink: true
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Books & Guides</h2>
          <p className="section-subtitle">
            Comprehensive resources to help you master every aspect of bread making, from basic techniques to advanced artisanal methods.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="ghost" 
            className="text-bread-800 hover:bg-bread-50"
            asChild
          >
            <Link to="/books">
              View All Books & Guides
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;
