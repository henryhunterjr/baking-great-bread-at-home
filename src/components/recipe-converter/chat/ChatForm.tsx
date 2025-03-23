
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ChatFormProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatForm: React.FC<ChatFormProps> = ({ 
  message, 
  setMessage, 
  onSubmit, 
  isLoading 
}) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        placeholder="Ask a question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
        className="bg-secondary/50 border-2 border-accent/30 focus:border-bread-700 shadow-sm"
      />
      <Button 
        type="submit"
        disabled={!message.trim() || isLoading}
        className="bg-bread-800 hover:bg-bread-900 shadow-md"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatForm;
