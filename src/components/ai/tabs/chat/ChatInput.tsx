
import React, { useState, FormEvent } from 'react';
import MessageInputForm from '../../chat/MessageInputForm';
import SuggestedQuestions from '../../chat/SuggestedQuestions';

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: FormEvent) => Promise<void>;
  isProcessing: boolean;
  showSuggestions?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  isProcessing,
  showSuggestions = false
}) => {
  const suggestedQuestions = [
    "Find me a sourdough recipe",
    "What's the current baking challenge?",
    "Generate a bread recipe with rosemary",
    "Convert my recipe for whole wheat bread",
    "Recommend a good bread baking book",
    "Do you have a recipe for cinnamon rolls?"
  ];
  
  return (
    <div className="p-4 border-t">
      <MessageInputForm 
        onSendMessage={() => {}} // Placeholder
        isProcessing={isProcessing}
        input={input}
        setInput={setInput}
        onSubmit={handleSendMessage}
        isLoading={isProcessing}
        showSuggestedQuestions={false}
      />
      
      {showSuggestions && (
        <div className="mt-4">
          <SuggestedQuestions 
            onQuestionSelect={setInput}
            questions={suggestedQuestions}
            onSelect={setInput}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
