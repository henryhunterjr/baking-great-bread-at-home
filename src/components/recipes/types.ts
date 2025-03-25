
export interface Recipe {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link: string;
  blogPostId?: string;
  tags?: string[]; // Adding this property to fix the type error
}
