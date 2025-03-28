
import React from 'react';
import ErrorAlert from '@/components/common/ErrorAlert';

interface ProfileErrorAlertProps {
  error: string | null;
}

const ProfileErrorAlert: React.FC<ProfileErrorAlertProps> = ({ error }) => {
  return <ErrorAlert error={error} />;
};

export default ProfileErrorAlert;
