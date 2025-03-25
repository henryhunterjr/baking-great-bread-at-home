
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '../utils/types';
import ChatContainer from './chat/ChatContainer';
import ChatInput from './chat/ChatInput';
import { useChatHandlers } from '../hooks/useChatHandlers';

interface ChatTabProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setActiveTab: (tab: string) => void;
  setRecipeText: (text: string) => void;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  setMessages,
  setActiveTab,
  setRecipeText,
  setRecipePrompt,
  isProcessing,
  setIsProcessing
}) => {
  const { toast } = useToast();
  
  const {
    input,
    setInput,
    handleSendMessage
  } = useChatHandlers({
    messages,
    setMessages,
    setActiveTab,
    setRecipeText,
    setRecipePrompt
  });
  
  return (
    <div className="flex flex-col h-full relative">
      <ChatContainer 
        messages={messages}
        isProcessing={isProcessing}
      />
      
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        showSuggestions={messages.length <= 1}
      />
    </div>
  );
};

export default ChatTab;
