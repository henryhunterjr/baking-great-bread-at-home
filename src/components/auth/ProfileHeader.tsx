
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, avatarUrl }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt={name || 'User'} />
        <AvatarFallback className="text-2xl bg-primary/10">
          {name?.charAt(0) || email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="font-medium text-lg">{name || 'New User'}</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
