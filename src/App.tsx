import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CoachLayout } from "./components/coach/CoachLayout";
import CommandCenter from "./pages/coach/CommandCenter";
import TeamAnalytics from "./pages/coach/TeamAnalytics";
import Players from "./pages/coach/Players";
import StrategyLab from "./pages/coach/StrategyLab";
import VODReview from "./pages/coach/VODReview";
import CoachHenry from "./pages/coach/CoachHenry";
import Settings from "./pages/coach/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Coach Portal Routes */}
          <Route path="/coach" element={<CoachLayout />}>
            <Route index element={<CommandCenter />} />
            <Route path="analytics" element={<TeamAnalytics />} />
            <Route path="players" element={<Players />} />
            <Route path="strategy" element={<StrategyLab />} />
            <Route path="vod" element={<VODReview />} />
            <Route path="henry" element={<CoachHenry />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
