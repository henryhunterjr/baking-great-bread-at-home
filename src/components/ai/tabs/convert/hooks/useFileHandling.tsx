
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromImage } from '@/lib/ai-services/recipe-processor';

interface UseFileHandlingProps {
  setRecipeText: (text: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

export const useFileHandling = ({
  setRecipeText,
  setIsProcessing,
  setMessages
}: UseFileHandlingProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        const extractedText = await extractTextFromImage(file);
        setRecipeText(extractedText);
      } else {
        // Handle text files
        const text = await file.text();
        setRecipeText(text);
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: "I've processed your recipe file and extracted the text. You can now edit it in the Recipe Converter tab.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "File Processing Error",
        description: error instanceof Error ? error.message : "Failed to process file",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const extractedText = await extractTextFromImage(file);
      setRecipeText(extractedText);
      
      const assistantMessage = {
        role: 'assistant',
        content: "I've processed your recipe photo and extracted the text. You can now edit it in the Recipe Converter tab.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing camera image:', error);
      toast({
        variant: "destructive",
        title: "Image Processing Error",
        description: error instanceof Error ? error.message : "Failed to process image",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteFromClipboard = async (setActiveTab: (tab: string) => void) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setActiveTab('convert');
      setRecipeText(clipboardText || "");
      
      if (clipboardText) {
        const assistantMessage = {
          role: 'assistant',
          content: "I've pasted the recipe from your clipboard. You can now edit it in the Recipe Converter tab.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Unable to access clipboard. Please paste the text manually.",
      });
    }
  };

  const clearText = () => setRecipeText('');

  return {
    fileInputRef,
    cameraInputRef,
    handleFileSelect,
    handleCameraCapture,
    handlePasteFromClipboard,
    clearText
  };
};
