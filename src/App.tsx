import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./pages/auth/AuthCallback";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CoachLayout } from "./components/coach/CoachLayout";
import CommandCenter from "./pages/coach/CommandCenter";
import TeamAnalytics from "./pages/coach/TeamAnalytics";
import Players from "./pages/coach/Players";
import StrategyLab from "./pages/coach/StrategyLab";
import VODReview from "./pages/coach/VODReview";
import CoachHenry from "./pages/coach/CoachHenry";
import Settings from "./pages/coach/Settings";
import WhatIfSimulator from "./pages/coach/WhatIfSimulator";
import TeamAgenda from "./pages/coach/TeamAgenda";
import TrainingScheduler from "./pages/coach/TrainingScheduler";
import { PlayerLayout } from "./components/player/PlayerLayout";
import PlayerDashboard from "./pages/player/PlayerDashboard";
import PlayerPerformance from "./pages/player/PlayerPerformance";
import PlayerDrills from "./pages/player/PlayerDrills";
import PlayerVOD from "./pages/player/PlayerVOD";
import PlayerLeaks from "./pages/player/PlayerLeaks";
import PlayerSettings from "./pages/player/PlayerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Coach Portal Routes - Protected */}
            <Route path="/coach" element={
              <ProtectedRoute allowedRoles={['coach']}>
                <CoachLayout />
              </ProtectedRoute>
            }>
              <Route index element={<CommandCenter />} />
              <Route path="analytics" element={<TeamAnalytics />} />
              <Route path="players" element={<Players />} />
              <Route path="strategy" element={<StrategyLab />} />
              <Route path="vod" element={<VODReview />} />
              <Route path="henry" element={<CoachHenry />} />
              <Route path="settings" element={<Settings />} />
              <Route path="what-if" element={<WhatIfSimulator />} />
              <Route path="simulator" element={<WhatIfSimulator />} />
              <Route path="agenda" element={<TeamAgenda />} />
              <Route path="training" element={<TrainingScheduler />} />
            </Route>
            
            {/* Player Terminal Routes - Protected */}
            <Route path="/player" element={
              <ProtectedRoute allowedRoles={['player']}>
                <PlayerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PlayerDashboard />} />
              <Route path="performance" element={<PlayerPerformance />} />
              <Route path="drills" element={<PlayerDrills />} />
              <Route path="vod" element={<PlayerVOD />} />
              <Route path="leaks" element={<PlayerLeaks />} />
              <Route path="settings" element={<PlayerSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
