
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
      className={`p-3 rounded-lg shadow-sm ${
        message.role === 'assistant' 
          ? 'bg-white border border-border dark:bg-slate-800 dark:border-slate-700 dark:text-white' 
          : 'bg-bread-800 text-white ml-4'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-bread-800 dark:text-bread-400" />
          <p className="text-sm text-muted-foreground dark:text-slate-300">Thinking...</p>
        </div>
      ) : (
        <p className="text-sm dark:text-slate-200">{message.content}</p>
      )}
    </div>
  );
};

export default ChatBubble;
