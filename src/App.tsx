
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/use-theme';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

import Index from '@/pages/Index';
import AppStore from '@/pages/AppStore';
import Blog from '@/pages/Blog';
import CareCenter from '@/pages/CareCenter';
import ChallengesArchive from '@/pages/ChallengesArchive';
import Community from '@/pages/Community';
import ComingSoon from '@/pages/ComingSoon';
import NotFound from '@/pages/NotFound';
import RecipeConverter from '@/pages/RecipeConverter';
import AffiliateCollection from '@/pages/AffiliateCollection';
import Tools from '@/pages/Tools';
import Recipes from '@/pages/Recipes';
import Books from '@/pages/Books';
import About from '@/pages/About';

import './App.css';

function App() {
  // Use the scroll to top hook
  useScrollToTop();
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="bread-theme">
      <Toaster />
      <FloatingAIButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/app" element={<AppStore />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/books" element={<Books />} />
        <Route path="/care-center" element={<CareCenter />} />
        <Route path="/challenges" element={<ChallengesArchive />} />
        <Route path="/community" element={<Community />} />
        <Route path="/recipe-converter" element={<RecipeConverter />} />
        <Route path="/affiliate-collection" element={<AffiliateCollection />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/about" element={<About />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
