
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import ChallengesArchive from "./pages/ChallengesArchive";
import AppStore from "./pages/AppStore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/challenges" element={<ChallengesArchive />} />
            <Route path="/books" element={<NotFound />} />
            <Route path="/tools" element={<NotFound />} />
            <Route path="/coaching" element={<NotFound />} />
            <Route path="/blog" element={<NotFound />} />
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
