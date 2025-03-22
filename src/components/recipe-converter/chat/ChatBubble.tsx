
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from '../types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoading = false }) => {
  return (
    <div 
      className={`p-3 rounded-lg ${
        message.role === 'assistant' 
          ? 'bg-background border border-border' 
          : 'bg-bread-800 text-white ml-4'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-bread-800" />
          <p className="text-sm text-muted-foreground">Thinking...</p>
        </div>
      ) : (
        <p className="text-sm">{message.content}</p>
      )}
    </div>
  );
};

export default ChatBubble;
