
import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageInputFormProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  showSuggestedQuestions?: boolean;
  input?: string;
  setInput?: React.Dispatch<React.SetStateAction<string>>;
  onSubmit?: (e: FormEvent) => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean; // Added the disabled prop
}

const MessageInputForm: React.FC<MessageInputFormProps> = ({ 
  onSendMessage, 
  isProcessing,
  showSuggestedQuestions = false,
  input: externalInput,
  setInput: externalSetInput,
  onSubmit: externalOnSubmit,
  isLoading,
  disabled
}) => {
  const [internalInput, setInternalInput] = useState('');
  const isMobile = useIsMobile();
  
  // Use either external or internal state
  const chatInput = externalInput !== undefined ? externalInput : internalInput;
  const setChatInput = externalSetInput || setInternalInput;
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    if (externalOnSubmit) {
      externalOnSubmit(e);
    } else {
      onSendMessage(chatInput);
      setChatInput('');
    }
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
          disabled={isProcessing || isLoading || disabled}
          className="bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!chatInput.trim() || isProcessing || isLoading || disabled}
          className="bg-bread-800 hover:bg-bread-700 shadow-md flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInputForm;
