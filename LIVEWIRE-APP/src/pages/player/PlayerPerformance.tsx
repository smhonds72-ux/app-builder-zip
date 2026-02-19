import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  Filter,
  Eye
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const performanceTrend = [
  { date: 'Jan 1', dsv: 45, ope: 68, tempo: 72 },
  { date: 'Jan 8', dsv: 52, ope: 72, tempo: 75 },
  { date: 'Jan 15', dsv: 48, ope: 70, tempo: 78 },
  { date: 'Jan 22', dsv: 58, ope: 75, tempo: 80 },
  { date: 'Jan 29', dsv: 65, ope: 78, tempo: 82 },
];

const matchHistory = [
  { id: '1', opponent: 'Team Liquid', result: 'win', dsv: '+12.5', ope: '82%', date: 'Today' },
  { id: '2', opponent: 'FlyQuest', result: 'win', dsv: '+8.2', ope: '75%', date: 'Yesterday' },
  { id: '3', opponent: '100 Thieves', result: 'loss', dsv: '-15.3', ope: '62%', date: '2 days ago' },
  { id: '4', opponent: 'TSM', result: 'win', dsv: '+5.8', ope: '78%', date: '4 days ago' },
  { id: '5', opponent: 'EG', result: 'loss', dsv: '-8.7', ope: '68%', date: '6 days ago' },
];

const statCards = [
  { title: 'Avg DSV', value: '+4.2', change: '+12%', positive: true, icon: TrendingUp },
  { title: 'OPE', value: '76%', change: '+8%', positive: true, icon: BarChart3 },
  { title: 'Tempo Efficiency', value: '82%', change: '+5%', positive: true, icon: TrendingUp },
  { title: 'Solo Deaths', value: '1.8', change: '-22%', positive: true, icon: TrendingDown },
];

export default function PlayerPerformance() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMatch, setSelectedMatch] = useState<typeof matchHistory[0] | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [filters, setFilters] = useState({
    wins: true,
    losses: true,
    showDsv: true,
    showOpe: true,
    showTempo: true,
  });

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    toast({
      title: "Time Range Updated",
      description: `Showing data for the last ${value === '7d' ? '7 days' : value === '30d' ? '30 days' : '90 days'}.`,
    });
  };

  const handleViewAllMatches = () => {
    navigate('/player/vod');
    toast({
      title: "Opening Match History",
      description: "Navigating to full match history...",
    });
  };

  const handleMatchClick = (match: typeof matchHistory[0]) => {
    setSelectedMatch(match);
    setShowMatchDetails(true);
  };

  const filteredMatches = matchHistory.filter(match => {
    if (match.result === 'win' && !filters.wins) return false;
    if (match.result === 'loss' && !filters.losses) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            PERFORMANCE METRICS
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and identify areas for improvement
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-32 bg-secondary/50 border-brand-blue/20">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-brand-blue/30">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Options</SheetTitle>
                <SheetDescription>
                  Customize which data is displayed in your performance view.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Match Results</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wins" 
                      checked={filters.wins}
                      onCheckedChange={(checked) => setFilters(f => ({ ...f, wins: checked as boolean }))}
                    />
                    <Label htmlFor="wins">Show Wins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="losses" 
                      checked={filters.losses}
                      onCheckedChange={(checked) => setFilters(f => ({ ...f, losses: checked as boolean }))}
                    />
                    <Label htmlFor="losses">Show Losses</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Chart Metrics</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dsv" 
                      checked={filters.showDsv}
                      onCheckedChange={(checked) => setFilters(f => ({ ...f, showDsv: checked as boolean }))}
                    />
                    <Label htmlFor="dsv">Show DSV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ope" 
                      checked={filters.showOpe}
                      onCheckedChange={(checked) => setFilters(f => ({ ...f, showOpe: checked as boolean }))}
                    />
                    <Label htmlFor="ope">Show OPE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tempo" 
                      checked={filters.showTempo}
                      onCheckedChange={(checked) => setFilters(f => ({ ...f, showTempo: checked as boolean }))}
                    />
                    <Label htmlFor="tempo">Show Tempo</Label>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-5 hover:border-brand-blue/40 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.title}</span>
              <stat.icon className={cn(
                "w-5 h-5",
                stat.positive ? "text-status-success" : "text-destructive"
              )} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-display font-bold text-foreground">{stat.value}</span>
              <span className={cn(
                "text-sm font-mono mb-1",
                stat.positive ? "text-status-success" : "text-destructive"
              )}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">PERFORMANCE TREND</h2>
          <div className="flex items-center gap-4">
            {filters.showDsv && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-blue" />
                <span className="text-sm text-muted-foreground">DSV</span>
              </div>
            )}
            {filters.showOpe && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">OPE</span>
              </div>
            )}
            {filters.showTempo && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-success" />
                <span className="text-sm text-muted-foreground">Tempo</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="colorDsv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--brand-blue))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--brand-blue))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOpe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              {filters.showDsv && (
                <Area 
                  type="monotone" 
                  dataKey="dsv" 
                  stroke="hsl(var(--brand-blue))" 
                  fillOpacity={1}
                  fill="url(#colorDsv)"
                  strokeWidth={2}
                />
              )}
              {filters.showOpe && (
                <Area 
                  type="monotone" 
                  dataKey="ope" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorOpe)"
                  strokeWidth={2}
                />
              )}
              {filters.showTempo && (
                <Line 
                  type="monotone" 
                  dataKey="tempo" 
                  stroke="hsl(var(--status-success))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--status-success))' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">MATCH HISTORY</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-blue hover:bg-brand-blue/10"
            onClick={handleViewAllMatches}
          >
            View All Matches
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-blue/20">
                <th className="text-left text-sm font-mono text-muted-foreground pb-3">OPPONENT</th>
                <th className="text-left text-sm font-mono text-muted-foreground pb-3">RESULT</th>
                <th className="text-left text-sm font-mono text-muted-foreground pb-3">DSV</th>
                <th className="text-left text-sm font-mono text-muted-foreground pb-3">OPE</th>
                <th className="text-left text-sm font-mono text-muted-foreground pb-3">DATE</th>
                <th className="text-right text-sm font-mono text-muted-foreground pb-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <tr 
                  key={match.id} 
                  className="border-b border-brand-blue/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => handleMatchClick(match)}
                >
                  <td className="py-4 font-medium text-foreground">{match.opponent}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-mono",
                      match.result === 'win' 
                        ? "bg-status-success/20 text-status-success" 
                        : "bg-destructive/20 text-destructive"
                    )}>
                      {match.result.toUpperCase()}
                    </span>
                  </td>
                  <td className={cn(
                    "py-4 font-mono",
                    match.dsv.startsWith('+') ? "text-status-success" : "text-destructive"
                  )}>
                    {match.dsv}
                  </td>
                  <td className="py-4 font-mono text-foreground">{match.ope}</td>
                  <td className="py-4 text-muted-foreground">{match.date}</td>
                  <td className="py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-brand-blue hover:bg-brand-blue/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMatchClick(match);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Match Details Dialog */}
      <Dialog open={showMatchDetails} onOpenChange={setShowMatchDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Match Details: vs {selectedMatch?.opponent}</DialogTitle>
            <DialogDescription>
              Performance breakdown for this match
            </DialogDescription>
          </DialogHeader>
          {selectedMatch && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Result</span>
                  <p className={cn(
                    "text-xl font-mono font-bold mt-1",
                    selectedMatch.result === 'win' ? "text-status-success" : "text-destructive"
                  )}>
                    {selectedMatch.result.toUpperCase()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <p className="text-xl font-mono font-bold text-foreground mt-1">
                    {selectedMatch.date}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">DSV</span>
                  <p className={cn(
                    "text-xl font-mono font-bold mt-1",
                    selectedMatch.dsv.startsWith('+') ? "text-status-success" : "text-destructive"
                  )}>
                    {selectedMatch.dsv}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">OPE</span>
                  <p className="text-xl font-mono font-bold text-foreground mt-1">
                    {selectedMatch.ope}
                  </p>
                </div>
              </div>
              <Button 
                className="w-full bg-brand-blue hover:bg-brand-blue/80"
                onClick={() => {
                  setShowMatchDetails(false);
                  navigate('/player/vod');
                }}
              >
                Watch VOD
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
