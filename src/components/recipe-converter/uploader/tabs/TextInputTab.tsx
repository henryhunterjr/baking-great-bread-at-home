
import React from 'react';
import ConvertTab from './ConvertTab';

interface TextInputTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isConverting: boolean;
  error?: string | null;
}

const TextInputTab: React.FC<TextInputTabProps> = ({
  recipeText,
  setRecipeText,
  onSubmit,
  isConverting,
  error
}) => {
  return (
    <ConvertTab
      recipeText={recipeText}
      setRecipeText={setRecipeText}
      onSubmit={onSubmit}
      isConverting={isConverting}
      error={error}
    />
  );
};

export default TextInputTab;
