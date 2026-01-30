import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'cyan' | 'blue' | 'green' | 'warning';
  delay?: number;
}

const variantStyles = {
  default: {
    border: 'border-primary/30',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    glow: 'group-hover:shadow-glow-cyan',
  },
  cyan: {
    border: 'border-primary/30',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    glow: 'group-hover:shadow-glow-cyan',
  },
  blue: {
    border: 'border-brand-blue/30',
    iconBg: 'bg-brand-blue/20',
    iconColor: 'text-brand-blue',
    glow: 'group-hover:shadow-glow-blue',
  },
  green: {
    border: 'border-status-success/30',
    iconBg: 'bg-status-success/20',
    iconColor: 'text-status-success',
    glow: 'group-hover:shadow-glow-green',
  },
  warning: {
    border: 'border-status-warning/30',
    iconBg: 'bg-status-warning/20',
    iconColor: 'text-status-warning',
    glow: '',
  },
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "group relative p-6 rounded-xl",
        "bg-card/50 backdrop-blur-xl border",
        styles.border,
        "transition-all duration-300 hover:-translate-y-1",
        styles.glow
      )}
    >
      {/* Corner accents */}
      <div className={cn("absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl", styles.border)} />
      <div className={cn("absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl", styles.border)} />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-display font-bold text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.isPositive ? "text-status-success" : "text-destructive"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-muted-foreground font-normal">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", styles.iconBg)}>
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
