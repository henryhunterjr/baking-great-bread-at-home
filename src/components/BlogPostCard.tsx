
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/services/BlogService';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-bread-100 h-full">
      <div className="aspect-video overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-4/5 mb-3" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-8 w-1/3" />
      </CardContent>
    </Card>
  );
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden card-hover border-bread-100 h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            // Fallback image if the original fails to load
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
          }}
        />
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="mb-3 text-xs text-muted-foreground">{post.date}</div>
        <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-bread-800 transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline mt-auto"
        >
          Read Article
          <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </a>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
