import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Dumbbell,
  Video,
  AlertTriangle,
  ChevronRight,
  Zap,
  Brain,
  Activity,
  Gauge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';
import { dataService } from '@/lib/dataService';
import { useDataMode } from '@/contexts/DataContext';

// Define proper interfaces
interface PerformanceData {
  metric: string;
  value: number;
  baseline: number;
}

interface TopLeak {
  id: string;
  title: string;
  value: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  drillAvailable: boolean;
  drillId: string | null;
}

interface UpcomingItem {
  type: 'drill' | 'vod';
  title: string;
  dueIn: string;
  status: 'pending' | 'scheduled';
  id: string;
}

const performanceData = [
  { metric: 'OPE', value: 78, baseline: 70 },
  { metric: 'DSV', value: 65, baseline: 70 },
  { metric: 'Tempo', value: 82, baseline: 70 },
  { metric: 'Mechanics', value: 88, baseline: 70 },
  { metric: 'Obj Gravity', value: 72, baseline: 70 },
  { metric: 'Utility', value: 75, baseline: 70 },
];

const topLeaks = [
  { 
    id: '1', 
    title: 'Solo Deaths', 
    value: '3.2 per game', 
    description: 'Mostly in side lane overextensions',
    severity: 'high',
    drillAvailable: true,
    drillId: '4'
  },
  { 
    id: '2', 
    title: 'Tempo Loss', 
    value: '-240g per game', 
    description: 'Suboptimal recall timings',
    severity: 'medium',
    drillAvailable: true,
    drillId: '3'
  },
  { 
    id: '3', 
    title: 'Vision Control', 
    value: '62% efficiency', 
    description: 'Ward placement optimization needed',
    severity: 'low',
    drillAvailable: false,
    drillId: null
  },
];

const upcomingItems = [
  { type: 'drill', title: 'Baron Positioning Drill', dueIn: '2 hours', status: 'pending', id: '1' },
  { type: 'vod', title: 'VOD Session: vs TL', dueIn: 'Tomorrow 2PM', status: 'scheduled', id: 'vod-1' },
  { type: 'drill', title: 'Wave Management', dueIn: '3 days', status: 'pending', id: '2' },
];

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const { isLiveMode } = useDataMode();
  const [playerData, setPlayerData] = useState<any>(null);
  const [performanceDataState, setPerformanceDataState] = useState<PerformanceData[]>(performanceData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (isLiveMode) {
        try {
          setLoading(true);
          console.log('📊 Player Dashboard: Fetching enhanced data...');
          
          const enhancedPlayerStats = await dataService.getEnhancedPlayerStats();
          
          // Get first player's data for dashboard
          const currentPlayer = enhancedPlayerStats[0];
          if (currentPlayer) {
            // Transform performance data
            const transformedPerformanceData = [
              { metric: 'OPE', value: Math.round(currentPlayer.ope * 100), baseline: 70 },
              { metric: 'DSV', value: Math.round((1 - currentPlayer.dsv) * 100), baseline: 70 },
              { metric: 'Tempo', value: Math.round((1 - currentPlayer.tempoLeak) * 100), baseline: 70 },
              { metric: 'Mechanics', value: Math.round(currentPlayer.acs / 3), baseline: 70 },
              { metric: 'Obj Gravity', value: Math.round(currentPlayer.mapControlScore * 100), baseline: 70 },
              { metric: 'Utility', value: Math.round(currentPlayer.economyEfficiency * 100), baseline: 70 },
            ];
            
            setPlayerData(currentPlayer);
            setPerformanceDataState(transformedPerformanceData);
            console.log('✅ Player Dashboard: Enhanced data loaded successfully');
          }
        } catch (error) {
          console.error('❌ Player Dashboard: Error fetching enhanced data:', error);
          // Fallback to mock data
          setPerformanceDataState(performanceData);
        } finally {
          setLoading(false);
        }
      } else {
        // Use mock data
        setPerformanceDataState(performanceData);
      }
    };

    fetchPlayerData();
  }, [isLiveMode]);

  const handleViewDrills = () => {
    navigate('/player/drills');
    toast({
      title: "Navigating to Drills",
      description: "3 new drills are waiting for you!",
    });
  };

  const handleViewDrill = (drillId: string | null) => {
    if (drillId) {
      navigate('/player/drills');
      toast({
        title: "Opening Drill",
        description: "Navigate to the drill to start practicing.",
      });
    }
  };

  const handleStartItem = (item: typeof upcomingItems[0]) => {
    if (item.type === 'drill') {
      navigate('/player/drills');
      toast({
        title: "Starting Drill",
        description: `Opening ${item.title}...`,
      });
    } else {
      navigate('/player/vod');
      toast({
        title: "Opening VOD Session",
        description: `Navigating to ${item.title}...`,
      });
    }
  };

  const handleViewAllTasks = () => {
    navigate('/player/drills');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            WELCOME BACK, JAX
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your performance overview and upcoming tasks
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-success/10 border border-status-success/30">
            <TrendingUp className="w-4 h-4 text-status-success" />
            <span className="text-sm font-mono text-status-success">TRENDING UP +12%</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-brand-blue/10 border border-brand-blue/30"
      >
        <div className="p-2 rounded-lg bg-brand-blue/20">
          <Dumbbell className="w-5 h-5 text-brand-blue" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">3 New Drills Assigned</p>
          <p className="text-sm text-muted-foreground">Coach assigned new positioning drills based on your recent performance</p>
        </div>
        <Button 
          variant="outline" 
          className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue/20"
          onClick={handleViewDrills}
        >
          View Drills
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">PERFORMANCE RADAR</h2>
            <span className="text-xs font-mono text-muted-foreground">Last 7 days</span>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={performanceDataState}>
                <PolarGrid stroke="hsl(var(--primary) / 0.2)" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Your Stats"
                  dataKey="value"
                  stroke="hsl(var(--brand-blue))"
                  fill="hsl(var(--brand-blue))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-blue" />
              <span className="text-sm text-muted-foreground">Your Stats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-muted-foreground border-dashed" />
              <span className="text-sm text-muted-foreground">Pro Baseline</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-status-warning" />
            <h2 className="text-xl font-display font-bold text-foreground">TOP 3 LEAKS</h2>
          </div>
          
          <div className="space-y-4">
            {topLeaks.map((leak, index) => (
              <div
                key={leak.id}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:bg-secondary/30",
                  leak.severity === 'high' && "border-destructive/30 bg-destructive/5",
                  leak.severity === 'medium' && "border-status-warning/30 bg-status-warning/5",
                  leak.severity === 'low' && "border-brand-blue/30 bg-brand-blue/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        leak.severity === 'high' && "bg-destructive",
                        leak.severity === 'medium' && "bg-status-warning",
                        leak.severity === 'low' && "bg-brand-blue"
                      )} />
                      <span className="font-medium text-foreground">{leak.title}</span>
                    </div>
                    <p className="text-lg font-mono text-foreground mt-1">{leak.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{leak.description}</p>
                  </div>
                </div>
                {leak.drillAvailable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-3 text-brand-blue hover:bg-brand-blue/10"
                    onClick={() => handleViewDrill(leak.drillId)}
                  >
                    View Drill <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">UPCOMING TASKS</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-brand-blue hover:bg-brand-blue/10"
              onClick={handleViewAllTasks}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-brand-blue/10 hover:border-brand-blue/30 transition-all"
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  item.type === 'drill' ? "bg-brand-blue/20" : "bg-primary/20"
                )}>
                  {item.type === 'drill' ? (
                    <Dumbbell className="w-5 h-5 text-brand-blue" />
                  ) : (
                    <Video className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">Due: {item.dueIn}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-brand-blue/30"
                  onClick={() => handleStartItem(item)}
                >
                  Start
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">WEEKLY PROGRESS</h2>
            <span className="text-xs font-mono text-muted-foreground">Week of Jan 27</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Drills Completed</span>
                <span className="font-mono text-foreground">5/8</span>
              </div>
              <Progress value={62.5} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">VOD Sessions Attended</span>
                <span className="font-mono text-foreground">2/3</span>
              </div>
              <Progress value={66.7} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Leak Improvement</span>
                <span className="font-mono text-status-success">+18%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="pt-4 border-t border-brand-blue/20">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-status-success" />
                <div>
                  <p className="font-medium text-foreground">Great Progress!</p>
                  <p className="text-sm text-muted-foreground">You're on track to hit your weekly goals</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
