
import React from 'react';
import ErrorAlert from '@/components/common/ErrorAlert';

interface AuthErrorAlertProps {
  error: string | null;
}

const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({ error }) => {
  return <ErrorAlert error={error} className="mx-6 mb-4" />;
};

export default AuthErrorAlert;
