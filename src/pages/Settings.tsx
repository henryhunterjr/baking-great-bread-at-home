
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import APIKeyForm from '@/components/ai/settings/APIKeyForm';
import { SettingsIcon, SunIcon, MoonIcon, UserIcon, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import ProfilePreferencesForm from '@/components/auth/ProfilePreferencesForm';
import StorageSettings from '@/components/settings/StorageSettings';

const Settings = () => {
  useScrollToTop();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16" id="main-content">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <SettingsIcon className="mr-2 h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            
            <Tabs defaultValue="api" className="space-y-6">
              <TabsList>
                <TabsTrigger value="api">API Configuration</TabsTrigger>
                <TabsTrigger value="preferences">User Preferences</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>
                      Configure API keys for external services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <APIKeyForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5" /> User Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your baking experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfilePreferencesForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="storage">
                <StorageSettings />
              </TabsContent>
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the appearance of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="theme-toggle">Theme</Label>
                        <div className="text-sm text-muted-foreground">
                          Switch between light and dark mode
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <SunIcon className="h-4 w-4" />
                        <Switch 
                          id="theme-toggle"
                          checked={theme === 'dark'}
                          onCheckedChange={handleThemeChange}
                        />
                        <MoonIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
