import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';

interface DataPoint {
  name: string;
  winRate: number;
  avgKDA: number;
  objectives: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  delay?: number;
}

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
            <span className="font-medium text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ data, delay = 0 }: PerformanceChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-foreground tracking-wide">PERFORMANCE TRENDS</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Win Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-blue" />
            <span className="text-xs text-muted-foreground">Objectives</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187 94% 43%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(187 94% 43%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorObjectives" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215 20% 65%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215 20% 65%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="hsl(187 94% 43%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWinRate)"
            />
            <Area
              type="monotone"
              dataKey="objectives"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorObjectives)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
