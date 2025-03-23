
import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from '../utils/types';
import MessageAttachment from './MessageAttachment';

interface MessageListProps {
  messages: ChatMessage[];
  isProcessing: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div 
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[90%] rounded-lg p-3 ${
              message.role === 'user' 
                ? 'bg-bread-800 text-white' 
                : 'bg-muted border border-border'
            }`}
          >
            <p className="text-sm whitespace-pre-line">{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            {message.role === 'assistant' && <MessageAttachment message={message} />}
          </div>
        </div>
      ))}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-muted border border-border">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-bread-800" />
              <p className="text-sm">Looking through Henry's knowledge...</p>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
