
export type StorageProvider = 'local' | 'firebase' | 'cloud';

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[] | Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  notes?: string[];
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  isConverted?: boolean;
  description?: string;
  tags?: string[];
}
