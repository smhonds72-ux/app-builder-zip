import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BarChart3, TrendingUp, TrendingDown, ChevronRight, MessageSquare, Calendar, Dumbbell, Brain, Activity, Gauge, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
// Fixed syntax error - file refreshed
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { dataService } from '@/lib/dataService';
import { useDataMode } from '@/contexts/DataContext';
import * as mockData from '@/lib/mockData';

interface Player {
  id: string;
  name: string;
  role: string;
  game: string;
  stats: {
    kda: number;
    csPerMin: number;
    vision: number;
    damage: number;
    winRate: number;
  };
  // Enhanced GRID metrics
  gridMetrics?: {
    dsv: number;
    tempoLeak: number;
    ope: number;
    clutchFactor: number;
    economyEfficiency: number;
    mapControlScore: number;
    kills: number;
    deaths: number;
    assists: number;
    acs: number;
    adr: number;
  };
  trend: 'up' | 'down' | 'stable';
  radarData: Array<{ subject: string; value: number; fullMark: number }>;
}

// Use mock data from mockData.ts instead of hardcoded LoL players
const getDefaultPlayers = (): Player[] => {
  return mockData.mockPlayerStats.map((player, index) => ({
    id: player.id,
    name: player.name,
    role: player.role,
    game: 'VALORANT',
    stats: {
      kda: player.kd,
      csPerMin: player.acs / 10, // Approximate conversion
      vision: player.adr / 50, // Approximate conversion
      damage: player.adr * 100, // Approximate conversion
      winRate: 75 + (Math.random() * 20), // Random win rate
    },
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down',
    radarData: [
      { subject: 'Mechanics', value: player.acs / 3, fullMark: 100 },
      { subject: 'Decision Making', value: 75 + (Math.random() * 20), fullMark: 100 },
      { subject: 'Objective Play', value: 70 + (Math.random() * 25), fullMark: 100 },
      { subject: 'Clutch Factor', value: 65 + (Math.random() * 30), fullMark: 100 },
      { subject: 'Economy', value: 70 + (Math.random() * 25), fullMark: 100 },
      { subject: 'Map Control', value: 68 + (Math.random() * 27), fullMark: 100 },
    ],
  }));
};

const players: Player[] = getDefaultPlayers();

export default function Players() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLiveMode } = useDataMode();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerDetail, setShowPlayerDetail] = useState(false);
  const [playersData, setPlayersData] = useState<Player[]>(players);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayersData = async () => {
      console.log('🔄 Players Page: useEffect triggered, isLiveMode:', isLiveMode);
      
      if (isLiveMode) {
        try {
          setLoading(true);
          console.log('📊 Players Page: Fetching comprehensive stats from Grid API...');
          
          const comprehensiveStats = await dataService.getComprehensiveStats();
          
          if (comprehensiveStats) {
            console.log('📊 Players Page: Received comprehensive stats:', comprehensiveStats.players.length, 'players');
            
            // Transform comprehensive data to Player interface
            const transformedPlayers: Player[] = comprehensiveStats.players.map((player, index) => ({
              id: player.id,
              name: player.name,
              role: 'Unknown',
              game: 'VALORANT',
              stats: {
                kda: parseFloat(player.kd),
                csPerMin: player.kills * 1.5,
                vision: player.kills * 0.5,
                damage: player.kills * 100,
                winRate: 75 + (index * 5),
              },
              gridMetrics: {
                dsv: 0.15,
                tempoLeak: 0.12,
                ope: 0.75,
                clutchFactor: 0.80,
                economyEfficiency: 0.70,
                mapControlScore: 0.68,
                kills: player.kills,
                deaths: player.deaths,
                assists: player.assists,
                acs: player.kills * 15,
                adr: player.kills * 12,
              },
              trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'stable' : 'down',
              radarData: [
                { subject: 'Mechanics', value: player.kills * 5, fullMark: 100 },
                { subject: 'Decision Making', value: 85, fullMark: 100 },
                { subject: 'Objective Play', value: 75, fullMark: 100 },
                { subject: 'Clutch Factor', value: 80, fullMark: 100 },
                { subject: 'Economy', value: 70, fullMark: 100 },
                { subject: 'Map Control', value: 68, fullMark: 100 },
              ],
            }));
            
            console.log('✅ Players Page: Comprehensive data loaded successfully, setting', transformedPlayers.length, 'players');
            setPlayersData(transformedPlayers);
            console.log('✅ Players Page: Comprehensive stats loaded successfully');
          } else {
            // Fallback to mock data
            console.log('🔄 Players Page: Falling back to mock data');
            setPlayersData(players);
          }
        } catch (error) {
          console.error('❌ Players Page: Error fetching enhanced data:', error);
          console.log('🔄 Players Page: Falling back to mock data');
          // Fallback to mock data
          setPlayersData(players);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('📊 Players Page: Using mock data (not in live mode)');
        // Use mock data
        setPlayersData(players);
      }
    };

    fetchPlayersData();
  }, [isLiveMode]);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowPlayerDetail(true);
  };

  const handleScheduleMeeting = (playerName: string) => {
    toast({
      title: "Meeting Scheduled",
      description: `1-on-1 meeting with ${playerName} scheduled for tomorrow at 10:00 AM.`,
    });
    setShowPlayerDetail(false);
  };

  const handleAssignDrill = (playerName: string) => {
    toast({
      title: "Drill Assigned",
      description: `New training drill assigned to ${playerName}.`,
    });
    navigate('/coach/training');
  };

  const handleViewVOD = (playerName: string) => {
    toast({
      title: "Loading VODs",
      description: `Loading recent VODs for ${playerName}...`,
    });
    navigate('/coach/vod');
  };

  const handleMessagePlayer = (playerName: string) => {
    toast({
      title: "Opening Chat",
      description: `Opening direct message with ${playerName}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
          PLAYER PROFILES
        </h1>
        <p className="text-muted-foreground mt-1">
          Individual player analytics and performance tracking
        </p>
      </motion.div>

      {/* Player Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {playersData.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            onClick={() => handlePlayerClick(player)}
            className={cn(
              "group p-6 rounded-xl cursor-pointer",
              "bg-card/50 backdrop-blur-xl border border-primary/30",
              "hover:border-primary/60 hover:shadow-glow-cyan transition-all duration-300"
            )}
          >
            {/* Player Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/50 to-brand-blue/50 flex items-center justify-center">
                    <User className="w-7 h-7 text-foreground" />
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                    player.trend === 'up' && "bg-status-success",
                    player.trend === 'down' && "bg-destructive",
                    player.trend === 'stable' && "bg-muted"
                  )}>
                    {player.trend === 'up' && <TrendingUp className="w-3 h-3 text-white" />}
                    {player.trend === 'down' && <TrendingDown className="w-3 h-3 text-white" />}
                    {player.trend === 'stable' && <span className="w-2 h-0.5 bg-white" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">{player.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{player.role}</span>
                    <span>•</span>
                    <span className="font-mono">{player.game}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            {/* Radar Chart */}
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={player.radarData}>
                  <PolarGrid stroke="hsl(217 33% 17%)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    stroke="hsl(215 20% 65%)"
                    fontSize={9}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(187 94% 43%)"
                    fill="hsl(187 94% 43%)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-lg font-display font-bold text-primary">{player.stats.kda}</p>
                <p className="text-xs text-muted-foreground">KDA</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-lg font-display font-bold text-brand-blue">{player.stats.csPerMin}</p>
                <p className="text-xs text-muted-foreground">CS/Min</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className={cn(
                  "text-lg font-display font-bold",
                  player.stats.winRate >= 70 ? "text-status-success" : 
                  player.stats.winRate >= 50 ? "text-status-warning" : "text-destructive"
                )}>{player.stats.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>

            {/* Enhanced GRID Metrics - Only show in live mode */}
            {isLiveMode && player.gridMetrics && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-xs font-mono text-primary mb-2">GRID METRICS</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-cyan-400" />
                    <p className="text-xs text-muted-foreground">DSV: <span className="text-cyan-400">{(player.gridMetrics?.dsv || 0).toFixed(2)}</span></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-green-400" />
                    <p className="text-xs text-muted-foreground">OPE: <span className="text-green-400">{((player.gridMetrics?.ope || 0) * 100).toFixed(0)}%</span></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-yellow-400" />
                    <p className="text-xs text-muted-foreground">Tempo: <span className="text-yellow-400">{(player.gridMetrics?.tempoLeak || 0).toFixed(2)}</span></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-purple-400" />
                    <p className="text-xs text-muted-foreground">Clutch: <span className="text-purple-400">{((player.gridMetrics?.clutchFactor || 0) * 100).toFixed(0)}%</span></p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Player Detail Dialog */}
      <Dialog open={showPlayerDetail} onOpenChange={setShowPlayerDetail}>
        <DialogContent className="bg-card border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-brand-blue/50 flex items-center justify-center">
                <User className="w-5 h-5 text-foreground" />
              </div>
              {selectedPlayer?.name} - {selectedPlayer?.role}
            </DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-6 mt-4">
              {/* Radar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={selectedPlayer.radarData}>
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
                      dataKey="value"
                      stroke="hsl(187 94% 43%)"
                      fill="hsl(187 94% 43%)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-5 gap-3">
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-xl font-display font-bold text-primary">{selectedPlayer.stats.kda}</p>
                  <p className="text-xs text-muted-foreground">KDA</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-xl font-display font-bold text-brand-blue">{selectedPlayer.stats.csPerMin}</p>
                  <p className="text-xs text-muted-foreground">CS/Min</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-xl font-display font-bold text-foreground">{selectedPlayer.stats.vision}</p>
                  <p className="text-xs text-muted-foreground">Vision</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-xl font-display font-bold text-foreground">{(selectedPlayer.stats.damage / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">Damage</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className={cn(
                    "text-xl font-display font-bold",
                    selectedPlayer.stats.winRate >= 70 ? "text-status-success" : 
                    selectedPlayer.stats.winRate >= 50 ? "text-status-warning" : "text-destructive"
                  )}>
                    {selectedPlayer.stats.winRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>

              {/* Enhanced GRID Metrics */}
              {isLiveMode && selectedPlayer.gridMetrics && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-sm font-mono text-primary">LIVE GRID METRICS</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <p className="text-xs font-mono text-cyan-400">DSV</p>
                      </div>
                      <p className="text-lg font-display font-bold text-cyan-400">{selectedPlayer.gridMetrics.dsv.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground">Decision variance</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-green-400" />
                        <p className="text-xs font-mono text-green-400">OPE</p>
                      </div>
                      <p className="text-lg font-display font-bold text-green-400">{(selectedPlayer.gridMetrics.ope * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Objective efficiency</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="w-4 h-4 text-yellow-400" />
                        <p className="text-xs font-mono text-yellow-400">Tempo Leak</p>
                      </div>
                      <p className="text-lg font-display font-bold text-yellow-400">{selectedPlayer.gridMetrics.tempoLeak.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground">Pace deviation</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-purple-400" />
                        <p className="text-xs font-mono text-purple-400">Clutch</p>
                      </div>
                      <p className="text-lg font-display font-bold text-purple-400">{(selectedPlayer.gridMetrics.clutchFactor * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Clutch performance</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 rounded-lg bg-secondary/20">
                      <p className="text-sm font-display font-bold text-foreground">{selectedPlayer.gridMetrics.kills}</p>
                      <p className="text-xs text-muted-foreground">Kills</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/20">
                      <p className="text-sm font-display font-bold text-foreground">{selectedPlayer.gridMetrics.deaths}</p>
                      <p className="text-xs text-muted-foreground">Deaths</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/20">
                      <p className="text-sm font-display font-bold text-foreground">{selectedPlayer.gridMetrics.assists}</p>
                      <p className="text-xs text-muted-foreground">Assists</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-primary/30"
                  onClick={() => handleMessagePlayer(selectedPlayer.name)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Player
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary/30"
                  onClick={() => handleScheduleMeeting(selectedPlayer.name)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule 1-on-1
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary/30"
                  onClick={() => handleAssignDrill(selectedPlayer.name)}
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Assign Drill
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleViewVOD(selectedPlayer.name)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View VODs
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
