
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { suggestedQuestions } from '../utils/data';

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionSelect }) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'max-h-[30vh] overflow-y-auto pb-2' : ''}`}>
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            className="text-xs md:text-sm bg-secondary/80 rounded-full px-3 py-1.5 hover:bg-bread-100 transition-colors text-left"
            onClick={() => onQuestionSelect(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
