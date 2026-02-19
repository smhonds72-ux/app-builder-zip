import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Clock, 
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronRight,
  Filter,
  Target,
  Zap,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface Drill {
  id: string;
  title: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  status: 'in_progress' | 'pending' | 'completed';
  progress: number;
  assignedBy: string;
  linkedMatch: string;
  description: string;
}

const initialDrills: Drill[] = [
  {
    id: '1',
    title: 'Baron Positioning Drill',
    type: 'Positioning',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    status: 'in_progress',
    progress: 60,
    assignedBy: 'Coach',
    linkedMatch: 'vs TL - Baron Contest',
    description: 'Practice proper positioning around Baron pit including ward placement and entry angles.'
  },
  {
    id: '2',
    title: 'Wave Management Fundamentals',
    type: 'Mechanics',
    difficulty: 'Beginner',
    estimatedTime: 20,
    status: 'pending',
    progress: 0,
    assignedBy: 'Coach',
    linkedMatch: 'General Improvement',
    description: 'Master the basics of wave manipulation including freezing, slow pushing, and crashing.'
  },
  {
    id: '3',
    title: 'Tempo Recall Optimization',
    type: 'Decision Making',
    difficulty: 'Advanced',
    estimatedTime: 45,
    status: 'pending',
    progress: 0,
    assignedBy: 'Coach',
    linkedMatch: 'Tempo Leak Metric',
    description: 'Learn to identify optimal recall timings to minimize gold and experience loss.'
  },
  {
    id: '4',
    title: 'Side Lane Safety',
    type: 'Positioning',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    status: 'completed',
    progress: 100,
    assignedBy: 'Coach',
    linkedMatch: 'Solo Death Metric',
    description: 'Practice safe side lane positioning and map awareness.'
  },
  {
    id: '5',
    title: 'TP Flanks Practice',
    type: 'Mechanics',
    difficulty: 'Advanced',
    estimatedTime: 35,
    status: 'completed',
    progress: 100,
    assignedBy: 'Coach',
    linkedMatch: 'vs FlyQuest - Team Fight',
    description: 'Execute effective teleport flanks in various team fight scenarios.'
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'text-status-success bg-status-success/20';
    case 'Intermediate': return 'text-status-warning bg-status-warning/20';
    case 'Advanced': return 'text-destructive bg-destructive/20';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-5 h-5 text-status-success" />;
    case 'in_progress': return <PlayCircle className="w-5 h-5 text-brand-blue animate-pulse" />;
    default: return <Circle className="w-5 h-5 text-muted-foreground" />;
  }
};

export default function PlayerDrills() {
  const [drills, setDrills] = useState<Drill[]>(initialDrills);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [showDrillDialog, setShowDrillDialog] = useState(false);
  const [filters, setFilters] = useState({
    beginner: true,
    intermediate: true,
    advanced: true,
    positioning: true,
    mechanics: true,
    decisionMaking: true,
  });

  const activeDrills = drills.filter(d => d.status !== 'completed');
  const completedDrills = drills.filter(d => d.status === 'completed');
  const completionRate = Math.round((completedDrills.length / drills.length) * 100);

  const filteredActiveDrills = activeDrills.filter(drill => {
    const difficultyMatch = 
      (drill.difficulty === 'Beginner' && filters.beginner) ||
      (drill.difficulty === 'Intermediate' && filters.intermediate) ||
      (drill.difficulty === 'Advanced' && filters.advanced);
    
    const typeMatch = 
      (drill.type === 'Positioning' && filters.positioning) ||
      (drill.type === 'Mechanics' && filters.mechanics) ||
      (drill.type === 'Decision Making' && filters.decisionMaking);
    
    return difficultyMatch && typeMatch;
  });

  const handleStartDrill = (drill: Drill) => {
    setSelectedDrill(drill);
    setShowDrillDialog(true);
  };

  const confirmStartDrill = () => {
    if (!selectedDrill) return;
    
    setDrills(prev => prev.map(d => 
      d.id === selectedDrill.id 
        ? { ...d, status: 'in_progress' as const, progress: d.progress || 10 }
        : d
    ));
    
    setShowDrillDialog(false);
    toast({
      title: "Drill Started",
      description: `${selectedDrill.title} is now in progress. Good luck!`,
    });
  };

  const handleContinueDrill = (drill: Drill) => {
    const newProgress = Math.min(drill.progress + 20, 100);
    
    if (newProgress >= 100) {
      setDrills(prev => prev.map(d => 
        d.id === drill.id 
          ? { ...d, status: 'completed' as const, progress: 100 }
          : d
      ));
      toast({
        title: "Drill Completed! 🎉",
        description: `Congratulations! You've completed ${drill.title}.`,
      });
    } else {
      setDrills(prev => prev.map(d => 
        d.id === drill.id 
          ? { ...d, progress: newProgress }
          : d
      ));
      toast({
        title: "Progress Saved",
        description: `${drill.title} is now ${newProgress}% complete.`,
      });
    }
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
            MY DRILLS
          </h1>
          <p className="text-muted-foreground mt-1">
            Practice exercises assigned by your coach to improve specific skills
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-brand-blue/30">
              <Filter className="w-4 h-4 mr-2" />
              Filter Drills
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.beginner}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, beginner: checked }))}
            >
              Beginner
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.intermediate}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, intermediate: checked }))}
            >
              Intermediate
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.advanced}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, advanced: checked }))}
            >
              Advanced
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Type</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.positioning}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, positioning: checked }))}
            >
              Positioning
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.mechanics}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, mechanics: checked }))}
            >
              Mechanics
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.decisionMaking}
              onCheckedChange={(checked) => setFilters(f => ({ ...f, decisionMaking: checked }))}
            >
              Decision Making
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-brand-blue/20">
              <Target className="w-5 h-5 text-brand-blue" />
            </div>
            <span className="text-sm text-muted-foreground">Active Drills</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{activeDrills.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-status-success/20">
              <CheckCircle2 className="w-5 h-5 text-status-success" />
            </div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{completedDrills.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Completion Rate</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{completionRate}%</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-secondary/50 border border-brand-blue/20">
            <TabsTrigger value="active" className="data-[state=active]:bg-brand-blue/20">
              Active ({activeDrills.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-brand-blue/20">
              Completed ({completedDrills.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {filteredActiveDrills.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No drills match your current filters.
              </div>
            ) : (
              filteredActiveDrills.map((drill, index) => (
                <motion.div
                  key={drill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6 hover:border-brand-blue/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {getStatusIcon(drill.status)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-display font-bold text-foreground">{drill.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={cn("px-2 py-0.5 rounded text-xs font-mono", getDifficultyColor(drill.difficulty))}>
                              {drill.difficulty}
                            </span>
                            <span className="text-sm text-muted-foreground">{drill.type}</span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {drill.estimatedTime} min
                            </span>
                          </div>
                        </div>
                        <Button 
                          className="bg-brand-blue hover:bg-brand-blue/80"
                          onClick={() => drill.status === 'in_progress' ? handleContinueDrill(drill) : handleStartDrill(drill)}
                        >
                          {drill.status === 'in_progress' ? 'Continue' : 'Start'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      
                      <p className="text-muted-foreground mt-3">{drill.description}</p>
                      
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-brand-blue/10">
                        <span className="text-sm text-muted-foreground">
                          Linked to: <span className="text-brand-blue">{drill.linkedMatch}</span>
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Assigned by: <span className="text-foreground">{drill.assignedBy}</span>
                        </span>
                      </div>
                      
                      {drill.status === 'in_progress' && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-mono text-foreground">{drill.progress}%</span>
                          </div>
                          <Progress value={drill.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6 space-y-4">
            {completedDrills.map((drill, index) => (
              <motion.div
                key={drill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card/50 backdrop-blur-xl border border-status-success/20 rounded-xl p-6 opacity-80"
              >
                <div className="flex items-start gap-4">
                  {getStatusIcon(drill.status)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-display font-bold text-foreground">{drill.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={cn("px-2 py-0.5 rounded text-xs font-mono", getDifficultyColor(drill.difficulty))}>
                            {drill.difficulty}
                          </span>
                          <span className="text-sm text-muted-foreground">{drill.type}</span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {drill.estimatedTime} min
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-status-success/20 text-status-success text-sm font-mono">
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-3">{drill.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Start Drill Dialog */}
      <Dialog open={showDrillDialog} onOpenChange={setShowDrillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Drill</DialogTitle>
            <DialogDescription>
              You're about to start "{selectedDrill?.title}". This drill takes approximately {selectedDrill?.estimatedTime} minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Difficulty:</span> {selectedDrill?.difficulty}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Type:</span> {selectedDrill?.type}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Linked to:</span> {selectedDrill?.linkedMatch}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDrillDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/80" onClick={confirmStartDrill}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
