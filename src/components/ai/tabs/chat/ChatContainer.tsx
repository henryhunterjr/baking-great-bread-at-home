
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
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <MessageList 
        messages={messages}
        isProcessing={isProcessing}
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
