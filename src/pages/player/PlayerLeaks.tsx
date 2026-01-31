import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Dumbbell,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const leaksData = [
  { name: 'Solo Deaths', value: 320, improvement: -22, color: 'hsl(var(--destructive))' },
  { name: 'Tempo Loss', value: 240, improvement: -15, color: 'hsl(var(--status-warning))' },
  { name: 'Vision', value: 180, improvement: +8, color: 'hsl(var(--brand-blue))' },
  { name: 'CS Deficit', value: 150, improvement: -30, color: 'hsl(var(--status-success))' },
  { name: 'TP Usage', value: 120, improvement: +5, color: 'hsl(var(--primary))' },
];

const detailedLeaks = [
  {
    id: '1',
    title: 'Solo Deaths in Side Lane',
    category: 'Positioning',
    severity: 'high',
    avgPerGame: 3.2,
    goldLoss: 2880,
    trend: 'improving',
    trendValue: -22,
    causes: [
      'Overextending without vision',
      'Not tracking enemy jungler',
      'Poor wave state management'
    ],
    drillAvailable: true,
    drillName: 'Side Lane Safety'
  },
  {
    id: '2',
    title: 'Suboptimal Recall Timings',
    category: 'Decision Making',
    severity: 'medium',
    avgPerGame: 2.5,
    goldLoss: 600,
    trend: 'improving',
    trendValue: -15,
    causes: [
      'Recalling with bad wave state',
      'Missing cannon waves',
      'Not syncing with team tempo'
    ],
    drillAvailable: true,
    drillName: 'Tempo Recall Optimization'
  },
  {
    id: '3',
    title: 'Vision Control Efficiency',
    category: 'Awareness',
    severity: 'low',
    avgPerGame: null,
    goldLoss: null,
    trend: 'declining',
    trendValue: +8,
    causes: [
      'Ward placement timing',
      'Not using control wards effectively',
      'Predictable warding patterns'
    ],
    drillAvailable: false,
    drillName: null
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'border-destructive/50 bg-destructive/10';
    case 'medium': return 'border-status-warning/50 bg-status-warning/10';
    case 'low': return 'border-brand-blue/50 bg-brand-blue/10';
    default: return 'border-muted bg-muted/10';
  }
};

export default function PlayerLeaks() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            LEAKS ANALYSIS
          </h1>
          <p className="text-muted-foreground mt-1">
            Identify and address inefficiencies in your gameplay
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-success/10 border border-status-success/30">
          <TrendingDown className="w-4 h-4 text-status-success" />
          <span className="text-sm font-mono text-status-success">OVERALL LEAKS -18%</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">LEAK BREAKDOWN</h2>
          <span className="text-xs font-mono text-muted-foreground">Gold lost per game</span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaksData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}g`, 'Gold Lost']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {leaksData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-foreground">DETAILED BREAKDOWN</h2>
        
        {detailedLeaks.map((leak, index) => (
          <motion.div
            key={leak.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={cn(
              "bg-card/50 backdrop-blur-xl border rounded-xl p-6",
              getSeverityColor(leak.severity)
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg",
                  leak.severity === 'high' && "bg-destructive/20",
                  leak.severity === 'medium' && "bg-status-warning/20",
                  leak.severity === 'low' && "bg-brand-blue/20"
                )}>
                  <AlertTriangle className={cn(
                    "w-6 h-6",
                    leak.severity === 'high' && "text-destructive",
                    leak.severity === 'medium' && "text-status-warning",
                    leak.severity === 'low' && "text-brand-blue"
                  )} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground">{leak.title}</h3>
                  <span className="text-sm text-muted-foreground">{leak.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {leak.trend === 'improving' ? (
                  <TrendingDown className="w-4 h-4 text-status-success" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-destructive" />
                )}
                <span className={cn(
                  "font-mono text-sm",
                  leak.trend === 'improving' ? "text-status-success" : "text-destructive"
                )}>
                  {leak.trendValue > 0 ? '+' : ''}{leak.trendValue}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {leak.avgPerGame && (
                <div className="p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Avg per Game</span>
                  <p className="text-xl font-mono font-bold text-foreground">{leak.avgPerGame}</p>
                </div>
              )}
              {leak.goldLoss && (
                <div className="p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Gold Loss</span>
                  <p className="text-xl font-mono font-bold text-foreground">{leak.goldLoss}g</p>
                </div>
              )}
              <div className="p-3 rounded-lg bg-secondary/30">
                <span className="text-sm text-muted-foreground">Priority</span>
                <p className={cn(
                  "text-xl font-mono font-bold capitalize",
                  leak.severity === 'high' && "text-destructive",
                  leak.severity === 'medium' && "text-status-warning",
                  leak.severity === 'low' && "text-brand-blue"
                )}>
                  {leak.severity}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm font-medium text-foreground">Common Causes:</span>
              <ul className="mt-2 space-y-1">
                {leak.causes.map((cause, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            {leak.drillAvailable && (
              <div className="pt-4 border-t border-brand-blue/10">
                <Button className="bg-brand-blue hover:bg-brand-blue/80">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Start Drill: {leak.drillName}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
