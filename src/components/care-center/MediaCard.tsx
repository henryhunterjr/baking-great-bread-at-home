
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  type: 'video' | 'podcast';
  source: string;
}

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  const videoId = item.url.includes('youtu') 
    ? new URL(item.url).searchParams.get('v') || item.url.split('/').pop()?.split('?')[0]
    : null;
    
  const thumbnailUrl = item.thumbnailUrl || (videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?q=80&w=1000&auto=format&fit=crop');

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="rounded-full bg-white/90 text-black hover:bg-white">
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <CardContent className="flex-grow py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.type === 'video' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {item.type === 'video' ? 'Video' : 'Podcast'}
          </span>
          <span className="text-xs text-muted-foreground">{item.source}</span>
        </div>
        <h3 className="font-serif font-medium text-lg line-clamp-2">{item.title}</h3>
        {item.description && (
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{item.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full gap-2"
          asChild
        >
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Watch Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MediaCard;
