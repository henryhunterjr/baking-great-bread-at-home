
import { BookOpen, FileText, MessageSquare, Save, Upload } from 'lucide-react';

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: '.recipe-converter-panel',
    title: 'Recipe Converter',
    content: 'Convert any recipe into a structured format. You can paste text, upload a PDF, or take a photo.',
    placement: 'bottom',
    icon: <FileText size={18} />,
  },
  {
    target: '.pdf-upload-area',
    title: 'Upload Recipes',
    content: 'Upload recipe PDFs or images directly. The system will extract the text and help format it.',
    placement: 'bottom',
    icon: <Upload size={18} />,
  },
  {
    target: '.ai-assistant-panel',
    title: 'Bread Assistant',
    content: 'Ask questions about baking techniques or get advice about specific recipes from our AI baker.',
    placement: 'left',
    icon: <MessageSquare size={18} />,
  },
  {
    target: '.recipe-library',
    title: 'Recipe Library',
    content: 'All your saved recipes are stored here for easy access anytime you need them.',
    placement: 'right',
    icon: <BookOpen size={18} />,
  },
  {
    target: '.recipe-editor',
    title: 'Edit Recipes',
    content: 'Edit and refine your recipes. Add ingredients, modify instructions, and save your perfect version.',
    placement: 'top',
    icon: <Save size={18} />,
  }
];
