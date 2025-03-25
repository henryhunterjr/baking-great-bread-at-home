import React from 'react';
import { ExternalLink, Book, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage } from '../utils/types';

interface MessageAttachmentProps {
  message: ChatMessage;
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ message }) => {
  if (!message.attachedRecipe && !message.attachedBook && !message.attachedChallenge) {
    return null;
  }
  
  return (
    <div className="mt-3">
      {message.attachedRecipe && (
        <Card className="overflow-hidden border border-muted">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 h-24 sm:h-auto">
              <img 
                src={message.attachedRecipe.imageUrl || '/lovable-uploads/fc86e048-2d5e-41e6-b1ec-4577a7788784.png'} 
                alt={message.attachedRecipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = '/lovable-uploads/fc86e048-2d5e-41e6-b1ec-4577a7788784.png';
                }}
              />
            </div>
            <CardContent className="flex-1 p-3">
              <h4 className="font-medium text-sm mb-1">{message.attachedRecipe.title}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {message.attachedRecipe.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-7 mt-1"
                asChild
              >
                <a href={message.attachedRecipe.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Recipe
                </a>
              </Button>
            </CardContent>
          </div>
        </Card>
      )}
      
      {message.attachedBook && (
        <Card className="overflow-hidden border border-muted">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 h-24 sm:h-auto">
              <img 
                src={message.attachedBook.imageUrl}
                alt={message.attachedBook.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = '/placeholder-book.png';
                }}
              />
            </div>
            <CardContent className="flex-1 p-3">
              <h4 className="font-medium text-sm mb-1">{message.attachedBook.title}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {message.attachedBook.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium">By {message.attachedBook.author}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-7 mt-1"
                asChild
              >
                <a href={message.attachedBook.link} target="_blank" rel="noopener noreferrer">
                  <Book className="h-3 w-3 mr-1" />
                  Learn More
                </a>
              </Button>
            </CardContent>
          </div>
        </Card>
      )}
      
      {message.attachedChallenge && (
        <Card className="overflow-hidden border border-muted">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 h-24 sm:h-auto">
              <img 
                src={message.attachedChallenge.imageUrl}
                alt={message.attachedChallenge.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = '/placeholder-challenge.png';
                }}
              />
            </div>
            <CardContent className="flex-1 p-3">
              <h4 className="font-medium text-sm mb-1">{message.attachedChallenge.title}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {message.attachedChallenge.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-7 mt-1"
                asChild
              >
                <a href={message.attachedChallenge.link} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-3 w-3 mr-1" />
                  View Challenge
                </a>
              </Button>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MessageAttachment;
