import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Plus, 
  Play, 
  Users, 
  Map,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X,
  Archive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Strategy {
  id: string;
  name: string;
  game: 'LoL' | 'VALORANT';
  type: 'Team Comp' | 'Early Game' | 'Late Game' | 'Objective';
  status: 'active' | 'testing' | 'archived';
  winRate?: number;
  lastUsed?: string;
}

interface DraftNote {
  champion: string;
  priority: 'high' | 'medium' | 'low';
  note: string;
}

const initialStrategies: Strategy[] = [
  { id: '1', name: 'Dive Comp Alpha', game: 'LoL', type: 'Team Comp', status: 'active', winRate: 78, lastUsed: '2 days ago' },
  { id: '2', name: 'Baron Rush Protocol', game: 'LoL', type: 'Objective', status: 'active', winRate: 65, lastUsed: 'Yesterday' },
  { id: '3', name: 'Early Dragon Stack', game: 'LoL', type: 'Early Game', status: 'testing', winRate: 52 },
  { id: '4', name: 'Split Push Late', game: 'LoL', type: 'Late Game', status: 'active', winRate: 71, lastUsed: '5 days ago' },
  { id: '5', name: 'Protect the Carry', game: 'LoL', type: 'Team Comp', status: 'archived', winRate: 45 },
];

const initialDraftNotes: DraftNote[] = [
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);
  const [draftNotes, setDraftNotes] = useState<DraftNote[]>(initialDraftNotes);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Testing'>('All');
  const [showNewStrategy, setShowNewStrategy] = useState(false);
  const [showStrategyDetail, setShowStrategyDetail] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    game: 'LoL' as 'LoL' | 'VALORANT',
    type: 'Team Comp' as Strategy['type'],
    description: ''
  });
  const [newNote, setNewNote] = useState({
    champion: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    note: ''
  });

  const filteredStrategies = strategies.filter(s => {
    if (filter === 'All') return true;
    if (filter === 'Active') return s.status === 'active';
    if (filter === 'Testing') return s.status === 'testing';
    return true;
  });

  const handleCreateStrategy = () => {
    if (!newStrategy.name.trim()) {
      toast({ title: "Error", description: "Please enter a strategy name", variant: "destructive" });
      return;
    }
    
    const strategy: Strategy = {
      id: Date.now().toString(),
      name: newStrategy.name,
      game: newStrategy.game,
      type: newStrategy.type,
      status: 'testing',
    };
    
    setStrategies(prev => [strategy, ...prev]);
    setShowNewStrategy(false);
    setNewStrategy({ name: '', game: 'LoL', type: 'Team Comp', description: '' });
    toast({ title: "Strategy Created", description: `"${strategy.name}" has been added to testing.` });
  };

  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setShowStrategyDetail(true);
  };

  const handleArchiveStrategy = (id: string) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, status: 'archived' as const } : s));
    setShowStrategyDetail(false);
    toast({ title: "Strategy Archived", description: "Strategy moved to archive." });
  };

  const handleDeleteStrategy = (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id));
    setShowStrategyDetail(false);
    toast({ title: "Strategy Deleted", description: "Strategy has been removed." });
  };

  const handleAddNote = () => {
    if (!newNote.champion.trim() || !newNote.note.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    setDraftNotes(prev => [...prev, newNote]);
    setShowNewNote(false);
    setNewNote({ champion: '', priority: 'medium', note: '' });
    toast({ title: "Note Added", description: `Draft note for ${newNote.champion} added.` });
  };

  const handleLaunchSimulator = () => {
    navigate('/coach/what-if');
  };

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
        
        <Button onClick={() => setShowNewStrategy(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
              {(['All', 'Active', 'Testing'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                    filter === f 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredStrategies.map((strategy, index) => {
              const status = statusColors[strategy.status];
              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => handleStrategyClick(strategy)}
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

          <Button onClick={() => setShowNewNote(true)} variant="outline" className="w-full mt-4 border-primary/30 hover:bg-primary/10">
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
          <Button onClick={handleLaunchSimulator} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Launch Simulator
          </Button>
        </div>
      </motion.div>

      {/* New Strategy Dialog */}
      <Dialog open={showNewStrategy} onOpenChange={setShowNewStrategy}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create New Strategy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Strategy Name</label>
              <Input 
                value={newStrategy.name}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Aggressive Early Game"
                className="bg-secondary/50 border-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Game</label>
                <Select value={newStrategy.game} onValueChange={(v: 'LoL' | 'VALORANT') => setNewStrategy(prev => ({ ...prev, game: v }))}>
                  <SelectTrigger className="bg-secondary/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LoL">League of Legends</SelectItem>
                    <SelectItem value="VALORANT">VALORANT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                <Select value={newStrategy.type} onValueChange={(v: Strategy['type']) => setNewStrategy(prev => ({ ...prev, type: v }))}>
                  <SelectTrigger className="bg-secondary/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Team Comp">Team Comp</SelectItem>
                    <SelectItem value="Early Game">Early Game</SelectItem>
                    <SelectItem value="Late Game">Late Game</SelectItem>
                    <SelectItem value="Objective">Objective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Description</label>
              <Textarea 
                value={newStrategy.description}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the strategy..."
                className="bg-secondary/50 border-primary/20"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowNewStrategy(false)} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleCreateStrategy} className="bg-primary hover:bg-primary/90">
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Strategy Detail Dialog */}
      <Dialog open={showStrategyDetail} onOpenChange={setShowStrategyDetail}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{selectedStrategy?.name}</DialogTitle>
          </DialogHeader>
          {selectedStrategy && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Game</p>
                  <p className="font-medium text-foreground">{selectedStrategy.game}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{selectedStrategy.type}</p>
                </div>
              </div>
              {selectedStrategy.winRate && (
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className={cn(
                    "text-2xl font-display font-bold",
                    selectedStrategy.winRate >= 60 ? "text-status-success" : 
                    selectedStrategy.winRate >= 50 ? "text-status-warning" : "text-destructive"
                  )}>{selectedStrategy.winRate}%</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary/30"
                  onClick={() => handleArchiveStrategy(selectedStrategy.id)}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteStrategy(selectedStrategy.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  setShowStrategyDetail(false);
                  handleLaunchSimulator();
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Test in Simulator
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Note Dialog */}
      <Dialog open={showNewNote} onOpenChange={setShowNewNote}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add Draft Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Champion</label>
              <Input 
                value={newNote.champion}
                onChange={(e) => setNewNote(prev => ({ ...prev, champion: e.target.value }))}
                placeholder="e.g., Ahri"
                className="bg-secondary/50 border-primary/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
              <Select value={newNote.priority} onValueChange={(v: 'high' | 'medium' | 'low') => setNewNote(prev => ({ ...prev, priority: v }))}>
                <SelectTrigger className="bg-secondary/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Note</label>
              <Textarea 
                value={newNote.note}
                onChange={(e) => setNewNote(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Draft notes..."
                className="bg-secondary/50 border-primary/20"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowNewNote(false)} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleAddNote} className="bg-primary hover:bg-primary/90">
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
