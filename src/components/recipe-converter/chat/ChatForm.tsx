
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
        className="bg-white/90 dark:bg-slate-700 border-2 border-bread-700/40 dark:border-bread-600/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400 dark:text-white"
      />
      <Button 
        type="submit"
        disabled={!message.trim() || isLoading}
        className="bg-bread-800 hover:bg-bread-900 shadow-md dark:bg-bread-700 dark:hover:bg-bread-800"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatForm;
