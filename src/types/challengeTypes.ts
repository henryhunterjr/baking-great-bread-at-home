
export interface Challenge {
  id: string;
  title: string;
  date: Date;
  description: string;
  link: string;
  hashtag?: string;
  isCurrent: boolean;
}
