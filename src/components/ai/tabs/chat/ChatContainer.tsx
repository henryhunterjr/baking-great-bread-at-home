
import React, { useRef, useEffect } from 'react';
import MessageList from '../../chat/MessageList';
import { ChatMessage } from '../../utils/types';

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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
