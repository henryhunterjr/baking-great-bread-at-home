
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  link: string;
  tags?: string[]; // Add tags property that was missing
}

export interface BlogCache {
  posts: BlogPost[];
  timestamp: number;
}
