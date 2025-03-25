
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard, { Book } from './BookCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface BooksSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const BooksSection: React.FC<BooksSectionProps> = ({ sectionRef }) => {
  const isMobile = useIsMobile();

  const books: Book[] = [
    {
      id: 1,
      title: "Bread: A Journey Through History, Science, Art, and Community",
      image: "/lovable-uploads/1da6a5af-6269-4a91-ad2e-8d6bbb3bfd5d.png",
      description: "Explore the cultural and scientific history of bread through the ages.",
      link: "https://a.co/d/8QuikPc",
      isExternalLink: true
    },
    {
      id: 2,
      title: "Vitale Sourdough Mastery",
      image: "/lovable-uploads/f0ad0c4f-e5f5-4e6a-90b0-9bc1d341874b.png",
      description: "Master the art of fermentation and baking with this comprehensive guide.",
      link: "https://adobe.ly/3K4DVwG",
      isExternalLink: true
    },
    {
      id: 3,
      title: "Baking Great Bread at Home: A Journey Through the Seasons",
      image: "/lovable-uploads/bdd5d8b1-3208-448b-882e-339b7adb271d.png",
      description: "My upcoming cookbook featuring seasonal bread recipes and techniques.",
      link: "/coming-soon",
      isExternalLink: false
    },
    {
      id: 4,
      title: "Yeast Water Handbook",
      image: "/lovable-uploads/b3f7f1bf-daa4-44ab-b699-a894e6b9d759.png",
      description: "A comprehensive guide to yeast water fermentation.",
      link: "https://designrr.page/?id=459955&token=101509510&h=4420",
      isExternalLink: true
    },
    {
      id: 5,
      title: "From Oven to Market",
      image: "/lovable-uploads/702a0b38-fa2b-45fc-82e8-9098fe010f62.png",
      description: "Your complete guide to turning your baking passion into a thriving business.",
      link: "https://a.co/d/eNYayoA",
      isExternalLink: true
    },
    {
      id: 6,
      title: "Sourdough for the Rest of Us",
      image: "/lovable-uploads/147235a4-ba60-4748-8b66-0f589298ffe0.png",
      description: "Perfection Not Required - A free guide to get you started with sourdough baking.",
      link: "https://sourdough-simplified-gift.vercel.app/",
      isExternalLink: true
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 opacity-0 bg-[#eee] dark:bg-bread-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 dark:bg-bread-900/60 rounded-lg shadow-md p-6 md:p-8 text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Books & Guides</h2>
            <p className="text-muted-foreground dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Comprehensive resources to help you master the art and science of bread baking at any level.
            </p>
          </div>
          
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6 mb-8 md:mb-10`}>
            {books.slice(0, isMobile ? 2 : 3).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-3'} gap-4 md:gap-6 mb-8 md:mb-10`}>
            {books.slice(isMobile ? 2 : 3, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 hover:bg-bread-50 bg-white/80 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800 dark:bg-bread-900/50"
              asChild
            >
              <a href="http://bakinggreatbread.blog" target="_blank" rel="noopener noreferrer">
                Visit Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-bread-200 text-bread-800 hover:bg-bread-50 bg-white/80 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800 dark:bg-bread-900/50"
              asChild
            >
              <Link to="/care-center">
                Baker's Bench
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
