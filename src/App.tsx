
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/use-theme';
import FloatingAIButton from '@/components/ai/FloatingAIButton';

import Index from '@/pages/Index';
import AppStore from '@/pages/AppStore';
import Blog from '@/pages/Blog';
import CareCenter from '@/pages/CareCenter';
import ChallengesArchive from '@/pages/ChallengesArchive';
import ComingSoon from '@/pages/ComingSoon';
import NotFound from '@/pages/NotFound';
import RecipeConverter from '@/pages/RecipeConverter';
import AffiliateCollection from '@/pages/AffiliateCollection';
import Tools from '@/pages/Tools';

import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="bread-theme">
      <Toaster />
      <FloatingAIButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/app" element={<AppStore />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/care-center" element={<CareCenter />} />
        <Route path="/challenges" element={<ChallengesArchive />} />
        <Route path="/recipe-converter" element={<RecipeConverter />} />
        <Route path="/affiliate-collection" element={<AffiliateCollection />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
