import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Play, 
  Users, 
  Map,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Strategy {
  id: string;
  name: string;
  game: 'LoL' | 'VALORANT';
  type: 'Team Comp' | 'Early Game' | 'Late Game' | 'Objective';
  status: 'active' | 'testing' | 'archived';
  winRate?: number;
  lastUsed?: string;
}

const strategies: Strategy[] = [
  { id: '1', name: 'Dive Comp Alpha', game: 'LoL', type: 'Team Comp', status: 'active', winRate: 78, lastUsed: '2 days ago' },
  { id: '2', name: 'Baron Rush Protocol', game: 'LoL', type: 'Objective', status: 'active', winRate: 65, lastUsed: 'Yesterday' },
  { id: '3', name: 'Early Dragon Stack', game: 'LoL', type: 'Early Game', status: 'testing', winRate: 52 },
  { id: '4', name: 'Split Push Late', game: 'LoL', type: 'Late Game', status: 'active', winRate: 71, lastUsed: '5 days ago' },
  { id: '5', name: 'Protect the Carry', game: 'LoL', type: 'Team Comp', status: 'archived', winRate: 45 },
];

const draftNotes = [
  { champion: 'Gnar', priority: 'high', note: 'Must ban against TL, Impact comfort pick' },
  { champion: 'Rell', priority: 'medium', note: 'Strong with our engage comps' },
  { champion: 'Jinx', priority: 'high', note: 'Berserker pop-off potential' },
  { champion: 'Ahri', priority: 'low', note: 'Safe blind pick for mid' },
];

const statusColors = {
  active: { bg: 'bg-status-success/20', text: 'text-status-success', border: 'border-status-success/30' },
  testing: { bg: 'bg-status-warning/20', text: 'text-status-warning', border: 'border-status-warning/30' },
  archived: { bg: 'bg-muted/20', text: 'text-muted-foreground', border: 'border-muted/30' },
};

const priorityColors = {
  high: 'text-destructive bg-destructive/10',
  medium: 'text-status-warning bg-status-warning/10',
  low: 'text-muted-foreground bg-muted/10',
};

export default function StrategyLab() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            STRATEGY LAB
          </h1>
          <p className="text-muted-foreground mt-1">
            Design, test, and deploy team strategies
          </p>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          New Strategy
        </Button>
      </motion.div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategies List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-foreground tracking-wide">
              SAVED STRATEGIES
            </h3>
            <div className="flex gap-2">
              {['All', 'Active', 'Testing'].map((filter) => (
                <button
                  key={filter}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                    filter === 'All' 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {strategies.map((strategy, index) => {
              const status = statusColors[strategy.status];
              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg cursor-pointer",
                    "bg-secondary/30 border border-primary/10",
                    "hover:border-primary/30 transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{strategy.name}</p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          status.bg,
                          status.text
                        )}>
                          {strategy.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="font-mono">{strategy.game}</span>
                        <span>•</span>
                        <span>{strategy.type}</span>
                        {strategy.lastUsed && (
                          <>
                            <span>•</span>
                            <span>Used {strategy.lastUsed}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {strategy.winRate && (
                      <div className="text-right">
                        <p className={cn(
                          "font-display font-bold",
                          strategy.winRate >= 60 ? "text-status-success" : 
                          strategy.winRate >= 50 ? "text-status-warning" : "text-destructive"
                        )}>
                          {strategy.winRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Draft Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
        >
          <h3 className="font-display font-bold text-foreground tracking-wide mb-4">
            DRAFT PRIORITIES
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Quick notes for upcoming draft
          </p>

          <div className="space-y-3">
            {draftNotes.map((note, index) => (
              <motion.div
                key={note.champion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-3 rounded-lg bg-secondary/30 border border-primary/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground">{note.champion}</p>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded font-medium uppercase",
                    priorityColors[note.priority]
                  )}>
                    {note.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{note.note}</p>
              </motion.div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 border-primary/30 hover:bg-primary/10">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </motion.div>
      </div>

      {/* What-If Simulator Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-brand-blue/10 border border-primary/30"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/20">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg">WHAT-IF SIMULATOR</h3>
              <p className="text-muted-foreground">
                Run predictive simulations with different team compositions and strategies
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Launch Simulator
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
