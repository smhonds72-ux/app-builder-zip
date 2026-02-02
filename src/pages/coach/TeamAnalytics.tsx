import { motion } from 'framer-motion';
import { useState } from 'react';
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
  ChevronRight
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
  const [selectedPlayer, setSelectedPlayer] = useState<typeof playerStats[0] | null>(null);
  const [showPlayerDetail, setShowPlayerDetail] = useState(false);
  const [chartFilters, setChartFilters] = useState({
    kills: true,
    deaths: true,
    assists: true,
  });

  const handlePlayerClick = (player: typeof playerStats[0]) => {
    setSelectedPlayer(player);
    setShowPlayerDetail(true);
  };

  const handleExport = () => {
    toast({
      title: "Exporting analytics...",
      description: "Your report will download shortly.",
    });
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Team analytics report exported successfully.",
      });
    }, 1500);
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
            PLAYER KDA BREAKDOWN
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playerStats} barGap={4}>
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
