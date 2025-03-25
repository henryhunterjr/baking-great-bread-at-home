
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
  questions?: string[];
  onSelect?: React.Dispatch<React.SetStateAction<string>>;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  onQuestionSelect,
  questions,
  onSelect
}) => {
  const isMobile = useIsMobile();
  
  // Use default questions if none provided
  const defaultQuestions = [
    "Find me a sourdough recipe",
    "What's the current baking challenge?",
    "Generate a bread recipe with rosemary",
    "Convert my recipe for whole wheat bread",
    "Recommend a good bread baking book"
  ];
  
  const displayQuestions = questions || defaultQuestions;
  
  const handleQuestionClick = (question: string) => {
    if (onSelect) {
      onSelect(question);
    }
    onQuestionSelect(question);
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'max-h-[30vh] overflow-y-auto pb-2' : ''}`}>
        {displayQuestions.map((question, index) => (
          <button
            key={index}
            className="text-xs md:text-sm bg-[#F1F0FB] dark:bg-secondary/80 rounded-full px-3 py-1.5 hover:bg-bread-100 transition-colors text-left shadow-sm"
            onClick={() => handleQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
