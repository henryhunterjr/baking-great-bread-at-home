
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your baking assistant. How can I help you with your baking journey today?'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: 'This is a placeholder response. The AI assistant will be fully implemented in a future update.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-[calc(600px-60px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-bread-800 text-white' 
                  : 'bg-muted border border-border'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <form 
        onSubmit={handleSendMessage}
        className="border-t p-4 flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about baking..."
          className="flex-1"
        />
        <Button 
          type="submit"
          className="bg-bread-800 hover:bg-bread-700"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default AIAssistant;
