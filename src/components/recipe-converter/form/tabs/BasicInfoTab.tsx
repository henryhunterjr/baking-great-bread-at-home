
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const BasicInfoTab: React.FC = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipe Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Classic Sourdough Bread" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="introduction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="A brief description or story about this recipe..." 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="prepTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prep Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 30 minutes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="restTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rest/Rise Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 12-14 hours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="bakeTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bake Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 45 minutes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="totalTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 14-16 hours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
