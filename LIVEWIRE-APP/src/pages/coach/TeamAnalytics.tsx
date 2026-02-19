import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users,
  Swords,
  Shield,
  Flame,
  Clock,
  Filter,
  Download,
  ChevronRight,
  Brain,
  Activity,
  Gauge
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MetricCard } from '@/components/coach/MetricCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { dataService } from '@/lib/dataService';
import { useDataMode } from '@/contexts/DataContext';

// Mock data
const playerStats = [
  { name: 'Blaber', kills: 45, deaths: 22, assists: 78, cs: 2450, vision: 42 },
  { name: 'Fudge', kills: 38, deaths: 28, assists: 52, cs: 3200, vision: 35 },
  { name: 'Jojopyun', kills: 62, deaths: 25, assists: 48, cs: 3100, vision: 28 },
  { name: 'Berserker', kills: 85, deaths: 18, assists: 42, cs: 3800, vision: 22 },
  { name: 'Zven', kills: 12, deaths: 32, assists: 125, cs: 450, vision: 85 },
];

const radarData = [
  { subject: 'Early Game', A: 85, fullMark: 100 },
  { subject: 'Mid Game', A: 72, fullMark: 100 },
  { subject: 'Late Game', A: 88, fullMark: 100 },
  { subject: 'Team Fights', A: 92, fullMark: 100 },
  { subject: 'Objectives', A: 78, fullMark: 100 },
  { subject: 'Vision', A: 65, fullMark: 100 },
];

const gameDistribution = [
  { name: 'Wins', value: 72, color: 'hsl(160 84% 39%)' },
  { name: 'Losses', value: 28, color: 'hsl(0 84% 60%)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-xl border border-primary/30 rounded-lg p-3">
        <p className="font-mono text-sm text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.dataKey}:</span>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TeamAnalytics() {
  const { toast } = useToast();
  const { isLiveMode } = useDataMode();
  const [selectedPlayer, setSelectedPlayer] = useState<typeof playerStats[0] | null>(null);
  const [showPlayerDetail, setShowPlayerDetail] = useState(false);
  const [chartFilters, setChartFilters] = useState({
    kills: true,
    deaths: true,
    assists: true,
  });
  const [teamStats, setTeamStats] = useState<any>(null);
  const [playerStatsData, setPlayerStatsData] = useState(playerStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (isLiveMode) {
        try {
          setLoading(true);
          console.log('📊 Team Analytics: Fetching comprehensive stats...');
          
          const comprehensiveStats = await dataService.getComprehensiveStats();
          
          if (comprehensiveStats) {
            // Extract team stats from comprehensive data
            const enhancedTeamStats = {
              winRate: comprehensiveStats.teams.length > 0 
                ? (comprehensiveStats.teams.find(t => t.won)?.score || 0) / 13 * 100
                : 0,
              avgKD: comprehensiveStats.players.length > 0
                ? comprehensiveStats.players.reduce((sum, p) => sum + parseFloat(p.kd), 0) / comprehensiveStats.players.length
                : 0,
              clutchRate: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].ope)
                : 0,
              practiceHours: 142,
              paceScore: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].roundTimingEfficiency) / 100
                : 0,
              objectiveScore: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].ope) / 100
                : 0,
              communicationScore: 0.81,
              economyScore: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].roundTimingEfficiency) / 100
                : 0,
              dsvTeam: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].dsv) / 10
                : 0,
              tempoLeakTeam: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].tempoLeak) / 100
                : 0,
              opeTeam: comprehensiveStats.analytics.teamAnalytics.length > 0
                ? parseFloat(comprehensiveStats.analytics.teamAnalytics[0].ope) / 100
                : 0,
              openingSuccessRate: 65.0,
              retakeSuccessRate: 71.0
            };
            
            // Transform player data for analytics
            const transformedPlayerStats = comprehensiveStats.players.map(player => ({
              name: player.name,
              kills: player.kills,
              deaths: player.deaths,
              assists: player.assists,
              cs: player.kills * 15, // Approximate conversion
              vision: Math.round(player.kills * 0.5), // Approximate conversion
              gridMetrics: {
                dsv: 0.15,
                tempoLeak: 0.12,
                ope: 0.75,
                clutchFactor: 0.80,
                economyEfficiency: 0.70,
                mapControlScore: 0.68,
              }
            }));
            
            setTeamStats(enhancedTeamStats);
            setPlayerStatsData(transformedPlayerStats);
            console.log('✅ Team Analytics: Comprehensive stats loaded successfully');
          } else {
            // Fallback to mock data
            setTeamStats(mockTeamStats);
            setPlayerStatsData(playerStats);
          }
        } catch (error) {
          console.error('❌ Team Analytics: Error fetching enhanced data:', error);
          // Fallback to mock data
          setPlayerStatsData(playerStats);
        } finally {
          setLoading(false);
        }
      } else {
        // Use mock data
        setPlayerStatsData(playerStats);
      }
    };

    fetchAnalyticsData();
  }, [isLiveMode]);

  const handlePlayerClick = (player: typeof playerStats[0]) => {
    setSelectedPlayer(player);
    setShowPlayerDetail(true);
  };

  const handleExport = () => {
    toast({
      title: "Exporting analytics...",
      description: "Your report will download shortly.",
    });

    // Generate comprehensive report data
    const reportData = {
      reportType: 'Team Analytics',
      generatedAt: new Date().toISOString(),
      isLiveMode: isLiveMode,
      teamStats: teamStats,
      playerStats: playerStatsData,
      chartFilters: chartFilters,
      summary: {
        totalPlayers: playerStatsData.length,
        avgKD: playerStatsData.reduce((sum, p) => sum + (p.stats?.kda || 0), 0) / playerStatsData.length,
        totalKills: playerStatsData.reduce((sum, p) => sum + (p.kills || 0), 0),
        totalDeaths: playerStatsData.reduce((sum, p) => sum + (p.deaths || 0), 0),
        totalAssists: playerStatsData.reduce((sum, p) => sum + (p.assists || 0), 0),
      }
    };

    // Create and download CSV file
    const csvContent = generateTeamAnalyticsCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Team analytics report exported successfully.",
      });
    }, 1000);
  };

  const generateTeamAnalyticsCSV = (data: any) => {
    const headers = [
      'Report Type',
      'Generated At',
      'Data Mode',
      'Player Name',
      'Team',
      'KDA',
      'Kills',
      'Deaths', 
      'Assists',
      'CS/Min',
      'Vision Score',
      'Damage',
      'Win Rate',
      'DSV',
      'Tempo Leak',
      'OPE',
      'Clutch Factor',
      'Economy Efficiency',
      'Map Control Score'
    ];

    const rows = [
      [
        data.reportType,
        new Date(data.generatedAt).toLocaleString(),
        data.isLiveMode ? 'Live' : 'Mock',
        'TEAM SUMMARY',
        '',
        data.summary.avgKD.toFixed(2),
        data.summary.totalKills,
        data.summary.totalDeaths,
        data.summary.totalAssists,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]
    ];

    // Add individual player data
    data.playerStats.forEach((player: any) => {
      rows.push([
        data.reportType,
        new Date(data.generatedAt).toLocaleString(),
        data.isLiveMode ? 'Live' : 'Mock',
        player.name || '',
        player.team || '',
        (player.stats?.kda || 0).toFixed(2),
        player.kills || 0,
        player.deaths || 0,
        player.assists || 0,
        player.stats?.csPerMin || 0,
        player.stats?.vision || 0,
        player.stats?.damage || 0,
        player.stats?.winRate || 0,
        player.gridMetrics?.dsv || 0,
        player.gridMetrics?.tempoLeak || 0,
        player.gridMetrics?.ope || 0,
        player.gridMetrics?.clutchFactor || 0,
        player.gridMetrics?.economyEfficiency || 0,
        player.gridMetrics?.mapControlScore || 0
      ]);
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
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
            TEAM ANALYTICS
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive performance metrics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-primary/30">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chart Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Kills</span>
                  <Switch 
                    checked={chartFilters.kills}
                    onCheckedChange={(checked) => setChartFilters(prev => ({ ...prev, kills: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Deaths</span>
                  <Switch 
                    checked={chartFilters.deaths}
                    onCheckedChange={(checked) => setChartFilters(prev => ({ ...prev, deaths: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Assists</span>
                  <Switch 
                    checked={chartFilters.assists}
                    onCheckedChange={(checked) => setChartFilters(prev => ({ ...prev, assists: checked }))}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Top Metrics */}
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
              delay={0.1}
            />
            <MetricCard
              title="OPE"
              value={`${((teamStats as any).opeTeam * 100).toFixed(0)}%`}
              subtitle="Objective pressure efficiency"
              icon={Target}
              variant="green"
              delay={0.2}
            />
            <MetricCard
              title="DSV"
              value={(teamStats as any).dsvTeam.toFixed(2)}
              subtitle="Decision variance (lower better)"
              icon={Brain}
              variant={((teamStats as any).dsvTeam < 0.3) ? "green" : "warning"}
              delay={0.3}
            />
            <MetricCard
              title="Tempo Leak"
              value={(teamStats as any).tempoLeakTeam.toFixed(2)}
              subtitle="Pace deviation (lower better)"
              icon={Gauge}
              variant={((teamStats as any).tempoLeakTeam < 0.2) ? "green" : "warning"}
              delay={0.4}
            />
          </>
        ) : (
          // Standard metrics
          <>
            <MetricCard
              title="Total Matches"
              value="128"
              subtitle="This season"
              icon={Swords}
              variant="cyan"
              delay={0.1}
            />
            <MetricCard
              title="Avg. Game Time"
              value="32:15"
              subtitle="Across all games"
              icon={Clock}
              variant="blue"
              delay={0.2}
            />
            <MetricCard
              title="First Blood Rate"
              value="68%"
              subtitle="Per match"
              icon={Flame}
              trend={{ value: 5, isPositive: true }}
              variant="green"
              delay={0.3}
            />
            <MetricCard
              title="Objective Control"
              value="82%"
              subtitle="Dragons/Heralds"
              icon={Target}
              variant="warning"
              delay={0.4}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Stats Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
        >
          <h3 className="font-display font-bold text-foreground tracking-wide mb-6">
            PLAYER KDA BREAKDOWN {isLiveMode && <span className="text-xs text-primary ml-2">(LIVE DATA)</span>}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playerStatsData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(215 20% 65%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(215 20% 65%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {chartFilters.kills && <Bar dataKey="kills" fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />}
                {chartFilters.deaths && <Bar dataKey="deaths" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />}
                {chartFilters.assists && <Bar dataKey="assists" fill="hsl(187 94% 43%)" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {chartFilters.kills && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-success" />
                <span className="text-xs text-muted-foreground">Kills</span>
              </div>
            )}
            {chartFilters.deaths && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">Deaths</span>
              </div>
            )}
            {chartFilters.assists && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Assists</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Win/Loss Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
        >
          <h3 className="font-display font-bold text-foreground tracking-wide mb-6">
            WIN/LOSS RATIO
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gameDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gameDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-status-success">72%</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-destructive">28%</p>
              <p className="text-xs text-muted-foreground">Losses</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
        >
          <h3 className="font-display font-bold text-foreground tracking-wide mb-6">
            TEAM STRENGTHS ANALYSIS
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(217 33% 17%)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="hsl(215 20% 65%)"
                  fontSize={11}
                />
                <PolarRadiusAxis 
                  stroke="hsl(215 20% 65%)"
                  fontSize={10}
                  angle={30}
                />
                <Radar
                  name="Team"
                  dataKey="A"
                  stroke="hsl(187 94% 43%)"
                  fill="hsl(187 94% 43%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Player Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
        >
          <h3 className="font-display font-bold text-foreground tracking-wide mb-6">
            PLAYER PERFORMANCE RANKINGS
          </h3>
          <div className="space-y-4">
            {playerStats
              .map(player => ({
                ...player,
                kda: ((player.kills + player.assists) / Math.max(player.deaths, 1)).toFixed(2)
              }))
              .sort((a, b) => parseFloat(b.kda) - parseFloat(a.kda))
              .map((player, index) => (
                <div 
                  key={player.name}
                  onClick={() => handlePlayerClick(player)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer",
                    "bg-secondary/30 border border-primary/10",
                    "hover:border-primary/30 hover:bg-secondary/50 transition-all"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm",
                      index === 0 && "bg-status-warning/20 text-status-warning",
                      index === 1 && "bg-muted/50 text-muted-foreground",
                      index === 2 && "bg-orange-500/20 text-orange-400",
                      index > 2 && "bg-secondary text-muted-foreground"
                    )}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.kills}K / {player.deaths}D / {player.assists}A
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-display font-bold text-primary">{player.kda}</p>
                      <p className="text-xs text-muted-foreground">KDA</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Player Detail Dialog */}
      <Dialog open={showPlayerDetail} onOpenChange={setShowPlayerDetail}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{selectedPlayer?.name} - Detailed Stats</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-display font-bold text-status-success">{selectedPlayer.kills}</p>
                  <p className="text-xs text-muted-foreground">Kills</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-display font-bold text-destructive">{selectedPlayer.deaths}</p>
                  <p className="text-xs text-muted-foreground">Deaths</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-display font-bold text-primary">{selectedPlayer.assists}</p>
                  <p className="text-xs text-muted-foreground">Assists</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-lg font-display font-bold text-foreground">{selectedPlayer.cs}</p>
                  <p className="text-xs text-muted-foreground">Total CS</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-lg font-display font-bold text-foreground">{selectedPlayer.vision}</p>
                  <p className="text-xs text-muted-foreground">Vision Score</p>
                </div>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  setShowPlayerDetail(false);
                  window.location.href = '/coach/players';
                }}
              >
                View Full Profile
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
