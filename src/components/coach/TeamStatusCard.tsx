import { motion } from 'framer-motion';
import { User, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Player {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'in-game' | 'offline';
  game?: string;
  avatar?: string;
}

interface TeamStatusCardProps {
  players: Player[];
  delay?: number;
}

const statusColors = {
  'online': 'bg-status-success',
  'in-game': 'bg-status-warning',
  'offline': 'bg-muted-foreground/50',
};

const statusLabels = {
  'online': 'Online',
  'in-game': 'In Game',
  'offline': 'Offline',
};

export function TeamStatusCard({ players, delay = 0 }: TeamStatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground tracking-wide">TEAM STATUS</h3>
        <span className="text-xs font-mono text-muted-foreground">
          {players.filter(p => p.status !== 'offline').length}/{players.length} ACTIVE
        </span>
      </div>

      <div className="space-y-3">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.1 }}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              "bg-secondary/30 border border-primary/10",
              "hover:border-primary/30 transition-all duration-200"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-brand-blue/50 flex items-center justify-center">
                  <User className="w-5 h-5 text-foreground" />
                </div>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                  statusColors[player.status]
                )} />
              </div>
              <div>
                <p className="font-medium text-foreground">{player.name}</p>
                <p className="text-xs text-muted-foreground">{player.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {player.game && (
                <span className="text-xs font-mono text-status-warning bg-status-warning/10 px-2 py-0.5 rounded">
                  {player.game}
                </span>
              )}
              <span className={cn(
                "text-xs font-mono",
                player.status === 'online' && "text-status-success",
                player.status === 'in-game' && "text-status-warning",
                player.status === 'offline' && "text-muted-foreground"
              )}>
                {statusLabels[player.status]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
