
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageInputFormProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  showSuggestedQuestions: boolean;
}

const MessageInputForm: React.FC<MessageInputFormProps> = ({ 
  onSendMessage, 
  isProcessing,
  showSuggestedQuestions
}) => {
  const [chatInput, setChatInput] = useState('');
  const isMobile = useIsMobile();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    onSendMessage(chatInput);
    setChatInput('');
  };
  
  const handleSelectQuestion = (question: string) => {
    setChatInput(question);
    // For mobile, auto-submit the question
    if (isMobile) {
      setTimeout(() => {
        onSendMessage(question);
        setChatInput('');
      }, 100);
    }
  };
  
  return (
    <div className="p-3 md:p-4 border-t bg-background sticky bottom-0 w-full z-10">
      {showSuggestedQuestions && (
        <SuggestedQuestions onQuestionSelect={handleSelectQuestion} />
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Ask about recipes, techniques, or challenges..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          disabled={isProcessing}
          className="bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!chatInput.trim() || isProcessing}
          className="bg-bread-800 hover:bg-bread-700 shadow-md flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInputForm;
