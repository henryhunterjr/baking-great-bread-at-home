
import React from 'react';
import MediaCard, { MediaItem } from '@/components/care-center/MediaCard';

interface MediaListProps {
  items: MediaItem[];
}

const MediaList: React.FC<MediaListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MediaList;
