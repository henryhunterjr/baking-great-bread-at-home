
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { storageService } from '@/services/storage/index';
// Import the types directly to avoid naming conflicts
import type { StorageProvider as StorageProviderType } from '@/services/storage/types';

export function StorageSettings() {
  const [provider, setProvider] = useState<StorageProviderType>('local');
  const [isSwitching, setIsSwitching] = useState(false);
  
  useEffect(() => {
    // Get current provider from localStorage
    const currentProvider = localStorage.getItem('storage_provider') as StorageProviderType || 'local';
    setProvider(currentProvider);
  }, []);
  
  const handleProviderChange = async () => {
    setIsSwitching(true);
    
    try {
      const success = await storageService.setProvider(provider);
      
      if (success) {
        toast.success(`Storage provider switched to ${provider}`);
      } else {
        toast.error('Failed to switch storage provider');
      }
    } catch (error) {
      console.error('Error switching provider:', error);
      toast.error('An error occurred while switching providers');
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Storage</CardTitle>
        <CardDescription>
          Choose where to store your recipes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={provider} onValueChange={(value: StorageProviderType) => setProvider(value)}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local" className="font-medium">Browser Storage</Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="firebase" id="firebase" disabled />
            <Label htmlFor="firebase" className="font-medium text-muted-foreground">Firebase (Coming Soon)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cloud" id="cloud" disabled />
            <Label htmlFor="cloud" className="font-medium text-muted-foreground">Cloud Storage (Coming Soon)</Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleProviderChange} 
          disabled={isSwitching || provider === localStorage.getItem('storage_provider')}
        >
          {isSwitching ? 'Switching...' : 'Apply Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StorageSettings;
