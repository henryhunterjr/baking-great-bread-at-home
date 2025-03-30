
import React from 'react';
import ConvertTab from './convert-tab/ConvertTab';

interface TextInputTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isConverting: boolean;
}

const TextInputTab: React.FC<TextInputTabProps> = ({
  recipeText,
  setRecipeText,
  onSubmit,
  isConverting
}) => {
  return (
    <ConvertTab
      recipeText={recipeText}
      setRecipeText={setRecipeText}
      onSubmit={onSubmit}
      isConverting={isConverting}
    />
  );
};

export default TextInputTab;
