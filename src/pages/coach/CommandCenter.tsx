import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  Zap,
  AlertTriangle,
  Brain,
  Activity,
  Gauge
} from 'lucide-react';
import { MetricCard } from '@/components/coach/MetricCard';
import { TeamStatusCard } from '@/components/coach/TeamStatusCard';
import { RecentMatchesCard } from '@/components/coach/RecentMatchesCard';
import { QuickActionsCard } from '@/components/coach/QuickActionsCard';
import { PerformanceChart } from '@/components/coach/PerformanceChart';
import { Button } from '@/components/ui/button';
import { dataService } from '@/lib/dataService';
import { useDataMode } from '@/contexts/DataContext';

// Mock data for fallback
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
  const { isLiveMode } = useDataMode();
  const [teamStats, setTeamStats] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [performanceDataState, setPerformanceDataState] = useState(performanceData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('📊 Command Center: Fetching enhanced data...');
        
        // Use comprehensive stats when in live mode
        const comprehensiveStats = isLiveMode ? await dataService.getComprehensiveStats() : null;
        
        const [teamData, playersData, matchesData, perfData] = await Promise.all([
          comprehensiveStats ? null : dataService.getTeamStats(),
          comprehensiveStats ? null : dataService.getPlayerStats(),
          dataService.getRecentMatches(3),
          dataService.getPerformanceData()
        ]);

        // If live mode with comprehensive stats, extract data from it
        if (comprehensiveStats) {
          // Extract team stats from comprehensive data
          const enhancedTeamData = {
            winRate: comprehensiveStats.teams.length > 0 
              ? (comprehensiveStats.teams.find(t => t.won)?.score || 0) / 13 * 100
              : 0,
            avgKD: comprehensiveStats.players.length > 0
              ? comprehensiveStats.players.reduce((sum, p) => sum + parseFloat(p.kd), 0) / comprehensiveStats.players.length
              : 0,
            clutchRate: comprehensiveStats.analytics.teamAnalytics.length > 0
              ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].ope)
              : 0,
            practiceHours: 142 // Default value
          };
          
          setTeamStats(enhancedTeamData);
          setPlayerStats(comprehensiveStats.players);
        } else {
          setTeamStats(teamData);
          setPlayerStats(playersData);
        }
        
        setRecentMatches(matchesData);
        setPerformanceDataState(perfData);
        
        console.log(`✅ Command Center: ${isLiveMode ? 'GRID' : 'Mock'} data loaded successfully`);
      } catch (error) {
        console.error('❌ Command Center: Error fetching data:', error);
        // Fallback to mock data
        setTeamStats({ winRate: 72, avgKD: 1.42, clutchRate: 34, practiceHours: 142 });
        setPlayerStats(mockPlayers);
        setRecentMatches(mockMatches);
        setPerformanceDataState(performanceData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLiveMode]);

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
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isLiveMode ? 'bg-status-success/10 border border-status-success/30' : 'bg-status-warning/10 border border-status-warning/30'}`}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className={`text-sm font-mono ${isLiveMode ? 'text-status-success' : 'text-status-warning'}`}>
            {isLiveMode ? 'LIVE DATA FEED' : 'DEMO MODE'}
          </span>
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
        {isLiveMode && teamStats && 'paceScore' in teamStats ? (
          // Enhanced GRID metrics
          <>
            <MetricCard
              title="Pace Score"
              value={`${((teamStats as any).paceScore * 100).toFixed(0)}%`}
              subtitle="Round timing efficiency"
              icon={Activity}
              variant="cyan"
              delay={0.2}
            />
            <MetricCard
              title="OPE"
              value={`${((teamStats as any).opeTeam * 100).toFixed(0)}%`}
              subtitle="Objective pressure efficiency"
              icon={Target}
              variant="green"
              delay={0.3}
            />
            <MetricCard
              title="DSV"
              value={(teamStats as any).dsvTeam.toFixed(2)}
              subtitle="Decision variance (lower better)"
              icon={Brain}
              variant={((teamStats as any).dsvTeam < 0.3) ? "green" : "warning"}
              delay={0.4}
            />
            <MetricCard
              title="Tempo Leak"
              value={(teamStats as any).tempoLeakTeam.toFixed(2)}
              subtitle="Pace deviation (lower better)"
              icon={Gauge}
              variant={((teamStats as any).tempoLeakTeam < 0.2) ? "green" : "warning"}
              delay={0.5}
            />
          </>
        ) : (
          // Standard metrics
          <>
            <MetricCard
              title="Win Rate"
              value={teamStats ? `${teamStats.winRate}%` : "72%"}
              subtitle="Last 30 days"
              icon={Trophy}
              trend={teamStats?.winRateChange ? { value: teamStats.winRateChange, isPositive: teamStats.winRateChange > 0 } : { value: 8, isPositive: true }}
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
              value={teamStats ? teamStats.avgKD.toFixed(2) : "4.2"}
              subtitle="Average"
              icon={TrendingUp}
              trend={teamStats?.kdChange ? { value: teamStats.kdChange, isPositive: teamStats.kdChange > 0 } : { value: 3, isPositive: false }}
              variant="warning"
              delay={0.5}
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart data={performanceDataState} delay={0.6} />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActionsCard delay={0.7} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamStatusCard players={playerStats.length > 0 ? playerStats : mockPlayers} delay={0.8} />
        <RecentMatchesCard matches={recentMatches.length > 0 ? recentMatches : mockMatches} delay={0.9} />
      </div>
    </div>
  );
}
