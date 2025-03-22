
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  link: string;
}

export interface BlogCache {
  posts: BlogPost[];
  timestamp: number;
}
