
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cloud, Database, HardDrive, Loader2 } from "lucide-react";
import { storageService } from '@/services/StorageService';

type StorageProvider = 'local' | 'firebase' | 'cloud';

const StorageSettings: React.FC = () => {
  const [currentProvider, setCurrentProvider] = useState<StorageProvider>('local');
  const [isChanging, setIsChanging] = useState(false);
  
  useEffect(() => {
    // Get current storage provider
    const provider = localStorage.getItem('storage_provider') as StorageProvider || 'local';
    setCurrentProvider(provider);
  }, []);
  
  const handleProviderChange = async (provider: StorageProvider) => {
    if (provider === currentProvider) return;
    
    try {
      setIsChanging(true);
      
      const result = await storageService.switchProvider(provider);
      
      if (result) {
        setCurrentProvider(provider);
        toast.success(`Storage provider changed to ${getProviderName(provider)}`);
      } else {
        throw new Error('Failed to change provider');
      }
    } catch (error) {
      console.error('Error changing provider:', error);
      toast.error('Failed to change storage provider. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };
  
  const getProviderName = (provider: StorageProvider): string => {
    switch(provider) {
      case 'local': return 'Browser Storage';
      case 'firebase': return 'Firebase';
      case 'cloud': return 'Cloud Storage';
      default: return 'Unknown Provider';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Storage</CardTitle>
        <CardDescription>
          Choose where your recipes are stored
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={currentProvider}
          onValueChange={(value) => handleProviderChange(value as StorageProvider)}
          className="space-y-4"
          disabled={isChanging}
        >
          <div className="flex items-center space-x-2 rounded-md border p-4">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local" className="flex-1 cursor-pointer">
              <div className="flex items-center">
                <HardDrive className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Browser Storage</p>
                  <p className="text-xs text-muted-foreground">
                    Recipes are saved in your browser's local storage
                  </p>
                </div>
              </div>
            </Label>
            {currentProvider === 'local' && <span className="text-xs text-muted-foreground">Current</span>}
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-4 opacity-60">
            <RadioGroupItem value="firebase" id="firebase" disabled />
            <Label htmlFor="firebase" className="flex-1 cursor-not-allowed">
              <div className="flex items-center">
                <Database className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Firebase (Coming Soon)</p>
                  <p className="text-xs text-muted-foreground">
                    Store recipes using Firebase Realtime Database
                  </p>
                </div>
              </div>
            </Label>
            {currentProvider === 'firebase' && <span className="text-xs text-muted-foreground">Current</span>}
          </div>
          
          <div className="flex items-center space-x-2 rounded-md border p-4 opacity-60">
            <RadioGroupItem value="cloud" id="cloud" disabled />
            <Label htmlFor="cloud" className="flex-1 cursor-not-allowed">
              <div className="flex items-center">
                <Cloud className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cloud Storage (Coming Soon)</p>
                  <p className="text-xs text-muted-foreground">
                    Sync recipes across all your devices
                  </p>
                </div>
              </div>
            </Label>
            {currentProvider === 'cloud' && <span className="text-xs text-muted-foreground">Current</span>}
          </div>
        </RadioGroup>
        
        {isChanging && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Migrating recipes...
            </span>
          </div>
        )}
        
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
            Browser Storage: Your recipes are stored in your browser and will be available only on this device.
          </p>
          <p className="mt-2">
            Additional storage options coming in future updates!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageSettings;
