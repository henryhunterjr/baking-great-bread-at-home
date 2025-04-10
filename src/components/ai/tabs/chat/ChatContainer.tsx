
import React, { useRef, useEffect } from 'react';
import MessageList from '../../chat/MessageList';
import { ChatMessage } from '../../utils/types';
import { Loader2 } from 'lucide-react';

interface ChatContainerProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isProcessing }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Filter out messages that only have attachments without content
  // Also filter out the recipe content if the recipe is displayed in the sidebar
  const displayMessages = messages.map(msg => {
    // If this message has a recipe attachment shown in the sidebar,
    // modify the message to just indicate there's a recipe
    if (msg.attachedRecipe) {
      return {
        ...msg,
        content: msg.content.includes("Here's a recipe") ? 
          `I've found a recipe for ${msg.attachedRecipe.title}. You can see the full recipe details on the left.` : 
          msg.content
      };
    }
    return msg;
  }).filter(msg => msg.content.trim() !== '');
  
  // Check if any message has a recipe attachment (used to adjust message layout)
  const hasRecipe = messages.some(msg => msg.attachedRecipe);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <MessageList 
        messages={displayMessages}
        isProcessing={isProcessing}
        hasRecipe={hasRecipe}
      />
      
      {isProcessing && (
        <div className="flex items-center justify-center py-2 animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin text-bread-600 dark:text-bread-400 mr-2" />
          <p className="text-sm text-muted-foreground">Processing your request...</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
