
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Camera, Clipboard } from 'lucide-react';

const TabsList: React.FC = () => {
  return (
    <ShadcnTabsList className="grid grid-cols-4 mb-6">
      <TabsTrigger value="text" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Text</span>
      </TabsTrigger>
      <TabsTrigger value="upload" className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Upload</span>
      </TabsTrigger>
      <TabsTrigger value="camera" className="flex items-center gap-2">
        <Camera className="h-4 w-4" />
        <span className="hidden sm:inline">Camera</span>
      </TabsTrigger>
      <TabsTrigger value="paste" className="flex items-center gap-2">
        <Clipboard className="h-4 w-4" />
        <span className="hidden sm:inline">Paste</span>
      </TabsTrigger>
    </ShadcnTabsList>
  );
};

export default TabsList;
