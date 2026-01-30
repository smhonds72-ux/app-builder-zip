import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Target,
  Video,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: 'cyan' | 'blue' | 'green' | 'warning';
  onClick?: () => void;
}

const colorStyles = {
  cyan: {
    bg: 'bg-primary/10 hover:bg-primary/20',
    border: 'border-primary/30',
    icon: 'text-primary',
  },
  blue: {
    bg: 'bg-brand-blue/10 hover:bg-brand-blue/20',
    border: 'border-brand-blue/30',
    icon: 'text-brand-blue',
  },
  green: {
    bg: 'bg-status-success/10 hover:bg-status-success/20',
    border: 'border-status-success/30',
    icon: 'text-status-success',
  },
  warning: {
    bg: 'bg-status-warning/10 hover:bg-status-warning/20',
    border: 'border-status-warning/30',
    icon: 'text-status-warning',
  },
};

const defaultActions: QuickAction[] = [
  {
    id: '1',
    label: 'Start VOD Review',
    description: 'Review latest match footage',
    icon: PlayCircle,
    color: 'cyan',
  },
  {
    id: '2',
    label: 'Schedule Practice',
    description: 'Set up team scrimmage',
    icon: Calendar,
    color: 'blue',
  },
  {
    id: '3',
    label: 'Create Strategy',
    description: 'Design new team comp',
    icon: Target,
    color: 'green',
  },
  {
    id: '4',
    label: 'Ask Coach Henry',
    description: 'AI-powered insights',
    icon: MessageSquare,
    color: 'warning',
  },
];

interface QuickActionsCardProps {
  actions?: QuickAction[];
  delay?: number;
}

export function QuickActionsCard({ actions = defaultActions, delay = 0 }: QuickActionsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
    >
      <h3 className="font-display font-bold text-foreground tracking-wide mb-4">QUICK ACTIONS</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const styles = colorStyles[action.color];
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + index * 0.1 }}
              className={cn(
                "flex flex-col items-start p-4 rounded-lg border",
                "transition-all duration-200",
                styles.bg,
                styles.border
              )}
              onClick={action.onClick}
            >
              <action.icon className={cn("w-6 h-6 mb-2", styles.icon)} />
              <p className="font-medium text-foreground text-sm text-left">{action.label}</p>
              <p className="text-xs text-muted-foreground text-left">{action.description}</p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
