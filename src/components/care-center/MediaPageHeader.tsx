
import React from 'react';

interface MediaPageHeaderProps {
  title: string;
  description: string;
}

const MediaPageHeader: React.FC<MediaPageHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground mb-10">
        {description}
      </p>
    </div>
  );
};

export default MediaPageHeader;
