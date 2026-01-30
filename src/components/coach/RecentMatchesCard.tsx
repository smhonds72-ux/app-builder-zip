import { motion } from 'framer-motion';
import { Trophy, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Match {
  id: string;
  opponent: string;
  result: 'win' | 'loss';
  score: string;
  game: 'VALORANT' | 'LoL';
  date: string;
  duration: string;
}

interface RecentMatchesCardProps {
  matches: Match[];
  delay?: number;
}

export function RecentMatchesCard({ matches, delay = 0 }: RecentMatchesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-foreground tracking-wide">RECENT MATCHES</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.1 }}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg cursor-pointer",
              "bg-secondary/30 border",
              match.result === 'win' 
                ? "border-status-success/20 hover:border-status-success/40" 
                : "border-destructive/20 hover:border-destructive/40",
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                match.result === 'win' ? "bg-status-success/20" : "bg-destructive/20"
              )}>
                <Trophy className={cn(
                  "w-5 h-5",
                  match.result === 'win' ? "text-status-success" : "text-destructive"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">vs {match.opponent}</p>
                  <span className={cn(
                    "text-xs font-mono px-1.5 py-0.5 rounded",
                    match.result === 'win' 
                      ? "bg-status-success/20 text-status-success" 
                      : "bg-destructive/20 text-destructive"
                  )}>
                    {match.result.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{match.game}</span>
                  <span>•</span>
                  <span>{match.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-foreground">{match.score}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{match.duration}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
