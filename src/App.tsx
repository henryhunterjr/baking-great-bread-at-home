
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import ChallengesArchive from "./pages/ChallengesArchive";
import Blog from "./pages/Blog";
import AppStore from "./pages/AppStore";
import RecipeConverter from "./pages/RecipeConverter";
import CareCenter from "./pages/CareCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/challenges" element={<ChallengesArchive />} />
            <Route path="/recipe-converter" element={<RecipeConverter />} />
            <Route path="/care-center" element={<CareCenter />} />
            <Route path="/books" element={<NotFound />} />
            <Route path="/tools" element={<NotFound />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/app" element={<AppStore />} />
            <Route path="/community" element={<NotFound />} />
            <Route path="/contact" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
