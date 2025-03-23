
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, Book, Calendar } from 'lucide-react';
import { ChatMessage } from '../utils/types';

interface MessageAttachmentProps {
  message: ChatMessage;
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ message }) => {
  if (message.attachedRecipe) {
    return (
      <Card className="mt-3 overflow-hidden border-bread-100">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 aspect-video">
            <img
              src={message.attachedRecipe.imageUrl}
              alt={message.attachedRecipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="p-4 sm:w-2/3">
            <h4 className="font-serif text-lg font-medium mb-2">{message.attachedRecipe.title}</h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{message.attachedRecipe.description}</p>
            <a 
              href={message.attachedRecipe.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline"
            >
              View Full Recipe
              <ArrowRight className="ml-2 h-3 w-3" />
            </a>
          </div>
        </div>
      </Card>
    );
  } else if (message.attachedBook) {
    return (
      <Card className="mt-3 overflow-hidden border-bread-100">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 aspect-video">
            <img
              src={message.attachedBook.imageUrl}
              alt={message.attachedBook.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576063892619-7e154ed1e19c?q=80&w=1000&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="p-4 sm:w-2/3">
            <h4 className="font-serif text-lg font-medium mb-1">{message.attachedBook.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">by {message.attachedBook.author}</p>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{message.attachedBook.description}</p>
            <a 
              href={message.attachedBook.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline"
            >
              Explore Book
              <Book className="ml-2 h-3 w-3" />
            </a>
          </div>
        </div>
      </Card>
    );
  } else if (message.attachedChallenge) {
    return (
      <Card className="mt-3 overflow-hidden border-bread-100">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 aspect-video">
            <img
              src={message.attachedChallenge.imageUrl}
              alt={message.attachedChallenge.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=80&w=1000&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="p-4 sm:w-2/3">
            <h4 className="font-serif text-lg font-medium mb-1">Challenge: {message.attachedChallenge.title}</h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{message.attachedChallenge.description}</p>
            <a 
              href={message.attachedChallenge.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline"
            >
              Join Challenge
              <Calendar className="ml-2 h-3 w-3" />
            </a>
          </div>
        </div>
      </Card>
    );
  }
  
  return null;
};

export default MessageAttachment;
