
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookCard, { Book } from '@/components/home/BookCard';

const Books = () => {
  const books: Book[] = [
    {
      id: 1,
      title: "Bread: A Journey Through History, Science, Art, and Community",
      image: "/lovable-uploads/147235a4-ba60-4748-8b66-0f589298ffe0.png",
      description: "Explore the cultural and scientific history of bread through the ages.",
      link: "https://amzn.to/3znnSrA",
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
      image: "/lovable-uploads/1da6a5af-6269-4a91-ad2e-8d6bbb3bfd5d.png",
      description: "Perfection Not Required - A free guide to get you started with sourdough baking.",
      link: "https://bit.ly/3XjRKP3",
      isExternalLink: true
    }
  ];

  return (
    <div className="min-h-screen bg-bread-50 dark:bg-bread-900">
      <Navbar />
      
      {/* Hero Section - Adjusted image positioning with object-position */}
      <div className="relative w-full">
        <div className="relative w-full h-[550px] overflow-hidden">
          <img 
            src="/lovable-uploads/4475b57a-8ff3-4c99-ac6d-24d1e49f0ad1.png" 
            alt="Baking Great Bread at Home - Books and Guides" 
            className="w-full h-full object-cover object-center object-position-y-top"
            style={{ objectPosition: "center 20%" }}  /* Reversed: Moving focus point up so more of bottom is shown */
          />
          <div className="absolute inset-0 bg-bread-950/60"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-bread-950/70 p-6 rounded-lg backdrop-blur-sm max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
              Books & Guides
            </h1>
            <p className="text-xl text-white mb-8">
              Explore our collection of books and guides to help you master the art of bread baking.
            </p>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-bread-900 dark:text-white mb-4">Our Books & Guides</h2>
          <p className="text-bread-700 dark:text-bread-200 max-w-3xl mx-auto text-lg">
            Comprehensive resources to help you master the art and science of bread baking at any level.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {books.slice(0, 3).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {books.slice(3, 6).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            className="border-bread-200 text-bread-800 hover:bg-bread-50 bg-white/80 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800 dark:bg-bread-900/50"
            asChild
          >
            <a href="http://bakinggreatbread.blog" target="_blank" rel="noopener noreferrer">
              Visit Blog
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Books;
