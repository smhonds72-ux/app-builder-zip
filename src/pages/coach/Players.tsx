import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BarChart3, TrendingUp, TrendingDown, ChevronRight, MessageSquare, Calendar, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  trend: 'up' | 'down' | 'stable';
  radarData: Array<{ subject: string; value: number; fullMark: number }>;
}

const players: Player[] = [
  {
    id: '1',
    name: 'Blaber',
    role: 'Jungle',
    game: 'LoL',
    stats: { kda: 4.8, csPerMin: 6.2, vision: 1.8, damage: 18500, winRate: 72 },
    trend: 'up',
    radarData: [
      { subject: 'Mechanics', value: 92, fullMark: 100 },
      { subject: 'Game Sense', value: 88, fullMark: 100 },
      { subject: 'Pathing', value: 95, fullMark: 100 },
      { subject: 'Team Play', value: 85, fullMark: 100 },
      { subject: 'Aggression', value: 90, fullMark: 100 },
    ],
  },
  {
    id: '2',
    name: 'Fudge',
    role: 'Top',
    game: 'LoL',
    stats: { kda: 3.2, csPerMin: 8.5, vision: 1.2, damage: 22000, winRate: 68 },
    trend: 'stable',
    radarData: [
      { subject: 'Mechanics', value: 85, fullMark: 100 },
      { subject: 'Game Sense', value: 82, fullMark: 100 },
      { subject: 'Laning', value: 88, fullMark: 100 },
      { subject: 'Team Play', value: 78, fullMark: 100 },
      { subject: 'Split Push', value: 90, fullMark: 100 },
    ],
  },
  {
    id: '3',
    name: 'Jojopyun',
    role: 'Mid',
    game: 'LoL',
    stats: { kda: 5.1, csPerMin: 9.2, vision: 1.5, damage: 28500, winRate: 75 },
    trend: 'up',
    radarData: [
      { subject: 'Mechanics', value: 95, fullMark: 100 },
      { subject: 'Game Sense', value: 88, fullMark: 100 },
      { subject: 'Roaming', value: 82, fullMark: 100 },
      { subject: 'Team Play', value: 80, fullMark: 100 },
      { subject: 'Carry', value: 92, fullMark: 100 },
    ],
  },
  {
    id: '4',
    name: 'Berserker',
    role: 'ADC',
    game: 'LoL',
    stats: { kda: 6.2, csPerMin: 10.5, vision: 1.1, damage: 32000, winRate: 78 },
    trend: 'up',
    radarData: [
      { subject: 'Mechanics', value: 98, fullMark: 100 },
      { subject: 'Positioning', value: 92, fullMark: 100 },
      { subject: 'CS', value: 96, fullMark: 100 },
      { subject: 'Team Play', value: 85, fullMark: 100 },
      { subject: 'Carry', value: 95, fullMark: 100 },
    ],
  },
  {
    id: '5',
    name: 'Zven',
    role: 'Support',
    game: 'LoL',
    stats: { kda: 3.8, csPerMin: 1.2, vision: 3.5, damage: 8500, winRate: 70 },
    trend: 'down',
    radarData: [
      { subject: 'Mechanics', value: 82, fullMark: 100 },
      { subject: 'Game Sense', value: 90, fullMark: 100 },
      { subject: 'Vision', value: 95, fullMark: 100 },
      { subject: 'Team Play', value: 92, fullMark: 100 },
      { subject: 'Roaming', value: 78, fullMark: 100 },
    ],
  },
];

export default function Players() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerDetail, setShowPlayerDetail] = useState(false);

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
        {players.map((player, index) => (
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
                  )}>{selectedPlayer.stats.winRate}%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>

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
