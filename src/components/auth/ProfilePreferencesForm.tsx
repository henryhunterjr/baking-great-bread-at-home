
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Save } from 'lucide-react';

interface PreferencesFormValues {
  measurementSystem: 'metric' | 'imperial';
  bakingExperience: 'beginner' | 'intermediate' | 'advanced';
  favoriteBreads: string[];
}

const breadOptions = [
  { label: 'Sourdough', value: 'Sourdough' },
  { label: 'French Baguette', value: 'French Baguette' },
  { label: 'Ciabatta', value: 'Ciabatta' },
  { label: 'Focaccia', value: 'Focaccia' },
  { label: 'Challah', value: 'Challah' },
  { label: 'Brioche', value: 'Brioche' },
  { label: 'Rye', value: 'Rye' },
  { label: 'Pita', value: 'Pita' }
];

const ProfilePreferencesForm: React.FC = () => {
  const { profile, updateUserPreferences } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<PreferencesFormValues>({
    defaultValues: {
      measurementSystem: profile?.preferences?.measurementSystem || 'metric',
      bakingExperience: profile?.preferences?.bakingExperience || 'beginner',
      favoriteBreads: profile?.preferences?.favoriteBreads || []
    }
  });

  const onSubmit = async (data: PreferencesFormValues) => {
    try {
      setLoading(true);
      await updateUserPreferences(data);
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="measurementSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Measurement System</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select measurement system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="metric">Metric (g, ml)</SelectItem>
                  <SelectItem value="imperial">Imperial (oz, cups)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bakingExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baking Experience</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="favoriteBreads"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Breads</FormLabel>
              <FormControl>
                <MultiSelect
                  options={breadOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select your favorite breads"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfilePreferencesForm;
