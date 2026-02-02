import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { MetricCard } from '@/components/coach/MetricCard';
import { TeamStatusCard } from '@/components/coach/TeamStatusCard';
import { RecentMatchesCard } from '@/components/coach/RecentMatchesCard';
import { QuickActionsCard } from '@/components/coach/QuickActionsCard';
import { PerformanceChart } from '@/components/coach/PerformanceChart';
import { Button } from '@/components/ui/button';

// Mock data
const mockPlayers = [
  { id: '1', name: 'Blaber', role: 'Jungle', status: 'in-game' as const, game: 'LoL Ranked' },
  { id: '2', name: 'Fudge', role: 'Top', status: 'online' as const },
  { id: '3', name: 'Jojopyun', role: 'Mid', status: 'online' as const },
  { id: '4', name: 'Berserker', role: 'ADC', status: 'in-game' as const, game: 'Solo Queue' },
  { id: '5', name: 'Zven', role: 'Support', status: 'offline' as const },
];

const mockMatches = [
  { id: '1', opponent: 'Team Liquid', result: 'win' as const, score: '3-1', game: 'LoL' as const, date: 'Today', duration: '48m' },
  { id: '2', opponent: 'FlyQuest', result: 'win' as const, score: '3-2', game: 'LoL' as const, date: 'Yesterday', duration: '1h 12m' },
  { id: '3', opponent: '100 Thieves', result: 'loss' as const, score: '1-3', game: 'LoL' as const, date: '2 days ago', duration: '52m' },
];

const performanceData = [
  { name: 'Week 1', winRate: 65, avgKDA: 3.2, objectives: 72 },
  { name: 'Week 2', winRate: 70, avgKDA: 3.8, objectives: 78 },
  { name: 'Week 3', winRate: 55, avgKDA: 2.9, objectives: 65 },
  { name: 'Week 4', winRate: 75, avgKDA: 4.1, objectives: 82 },
  { name: 'Week 5', winRate: 80, avgKDA: 4.5, objectives: 88 },
  { name: 'Week 6', winRate: 72, avgKDA: 3.9, objectives: 85 },
];

export default function CommandCenter() {
  const navigate = useNavigate();

  const handleViewStrategy = () => {
    navigate('/coach/strategy');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            COMMAND CENTER
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Coach. Here's your team overview.
          </p>
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-mono text-primary">LIVE DATA FEED</span>
        </div>
      </motion.div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-status-warning/10 border border-status-warning/30"
      >
        <div className="p-2 rounded-lg bg-status-warning/20">
          <AlertTriangle className="w-5 h-5 text-status-warning" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">Match Alert: vs Team Liquid in 2 hours</p>
          <p className="text-sm text-muted-foreground">Pre-match strategy session recommended. Review draft priorities.</p>
        </div>
        <Button 
          onClick={handleViewStrategy}
          variant="ghost"
          className="text-status-warning hover:bg-status-warning/20"
        >
          View Strategy
        </Button>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Win Rate"
          value="72%"
          subtitle="Last 30 days"
          icon={Trophy}
          trend={{ value: 8, isPositive: true }}
          variant="cyan"
          delay={0.2}
        />
        <MetricCard
          title="Avg. Match Duration"
          value="34:28"
          subtitle="Minutes"
          icon={Clock}
          variant="blue"
          delay={0.3}
        />
        <MetricCard
          title="Objective Control"
          value="85%"
          subtitle="Dragons & Barons"
          icon={Target}
          trend={{ value: 12, isPositive: true }}
          variant="green"
          delay={0.4}
        />
        <MetricCard
          title="Team KDA"
          value="4.2"
          subtitle="Average"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: false }}
          variant="warning"
          delay={0.5}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart data={performanceData} delay={0.6} />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActionsCard delay={0.7} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamStatusCard players={mockPlayers} delay={0.8} />
        <RecentMatchesCard matches={mockMatches} delay={0.9} />
      </div>
    </div>
  );
}
