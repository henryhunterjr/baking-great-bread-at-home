
import React from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  onQuestionSelect?: (question: string) => void; // Added for backward compatibility
  onSelect?: (question: string) => void; // Added for backward compatibility
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion,
  onQuestionSelect,
  onSelect
}) => {
  // Handle different prop names that might be used
  const handleQuestionSelect = (question: string) => {
    // Use the first available handler
    if (onSelectQuestion) {
      onSelectQuestion(question);
    } else if (onQuestionSelect) {
      onQuestionSelect(question);
    } else if (onSelect) {
      onSelect(question);
    }
  };

  if (!questions || !questions.length) return null;
  
  return (
    <div className="mt-3">
      <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            className="text-xs bg-background border border-border rounded-full px-2 py-1 hover:bg-accent transition-colors"
            onClick={() => handleQuestionSelect(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
