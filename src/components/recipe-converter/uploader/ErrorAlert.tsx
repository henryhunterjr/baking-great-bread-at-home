
import React from 'react';
import ErrorAlert from '@/components/common/ErrorAlert';

interface RecipeErrorAlertProps {
  error: string | null;
}

const RecipeErrorAlert: React.FC<RecipeErrorAlertProps> = ({ error }) => {
  return <ErrorAlert error={error} className="mb-4" />;
};

export default RecipeErrorAlert;
