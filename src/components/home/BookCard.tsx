
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Book {
  id: number;
  title: string;
  image: string;
  description: string;
  link: string; // primary link (for legacy/books with one link)
  isExternalLink: boolean;
  pdfLink?: string;
  flipBookLink?: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Card key={book.id} className="overflow-hidden card-hover border-bread-100">
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={book.image} 
          alt={book.title} 
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${(book.id === 1 || book.id === 4) ? 'object-top' : 'object-center'}`}
          style={{
            objectPosition: book.id === 1 ? 'center 15%' : 
                           book.id === 4 ? 'center 15%' : 
                           book.id === 6 ? 'center 30%' : 'center'
          }}
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-medium mb-2">{book.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{book.description}</p>
        {/* Special handling if both pdf and flipbook are present */}
        {book.pdfLink || book.flipBookLink ? (
          <div className="flex flex-col gap-2">
            {book.flipBookLink && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-bread-200 text-bread-800 hover:bg-bread-50"
                asChild
              >
                <a href={book.flipBookLink} target="_blank" rel="noopener noreferrer">
                  View Flip Book
                  <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            )}
            {book.pdfLink && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-bread-200 text-bread-800 hover:bg-bread-50"
                asChild
              >
                <a href={book.pdfLink} target="_blank" rel="noopener noreferrer">
                  View PDF
                  <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            )}
            {/* If this is Sourdough for the Rest of Us (ID: 6) and has both a main link and a flipBookLink, show both */}
            {(book.id === 6 && book.link && book.isExternalLink) && (
              <Button 
                variant="outline"
                size="sm"
                className="w-full border-bread-200 text-bread-800 hover:bg-bread-50"
                asChild
              >
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  View Book
                  <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-bread-200 text-bread-800 hover:bg-bread-50"
            asChild
          >
            {book.isExternalLink ? (
              <a href={book.link} target="_blank" rel="noopener noreferrer">
                View Book
                <ArrowRight className="ml-2 h-3 w-3" />
              </a>
            ) : (
              <Link to={book.link}>
                View Book
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;
