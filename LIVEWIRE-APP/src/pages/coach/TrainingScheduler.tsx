import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Calendar, 
  Plus,
  Clock,
  Users,
  ChevronRight,
  Video,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Drill {
  id: string;
  title: string;
  assignedTo: string[];
  status: 'in_progress' | 'not_started' | 'completed';
  linkedMatch: string;
  createdAt: string;
}

interface Session {
  id: string;
  match: string;
  date: string;
  time: string;
  attendees: string[];
  agendaItems: number;
}

const initialDrills: Drill[] = [
  {
    id: '1',
    title: 'Baron Positioning Drill',
    assignedTo: ['JAX', 'Blaber'],
    status: 'in_progress',
    linkedMatch: 'Match vs TL, 28:30 Baron contest',
    createdAt: 'Jan 30, 2026'
  },
  {
    id: '2',
    title: 'Tempo Management - Recalls',
    assignedTo: ['All'],
    status: 'not_started',
    linkedMatch: 'Tempo Leak metric',
    createdAt: 'Jan 29, 2026'
  },
  {
    id: '3',
    title: 'Wave Management Fundamentals',
    assignedTo: ['JAX', 'Berserker'],
    status: 'not_started',
    linkedMatch: 'General Improvement',
    createdAt: 'Jan 28, 2026'
  }
];

const initialSessions: Session[] = [
  {
    id: '1',
    match: 'Cloud9 vs TL',
    date: 'Feb 1, 2026',
    time: '2:00 PM',
    attendees: ['Coach', 'JAX', 'Blaber', 'Perkz', 'Berserker', 'Zven'],
    agendaItems: 5
  },
  {
    id: '2',
    match: 'Individual: Baron Focus',
    date: 'Feb 3, 2026',
    time: '10:00 AM',
    attendees: ['Coach', 'JAX', 'Blaber'],
    agendaItems: 3
  }
];

const completedSessions = [
  { id: '1', match: 'vs TSM', date: 'Jan 28', hasRecording: true },
  { id: '2', match: 'vs C9A Scrimmage', date: 'Jan 25', hasRecording: true },
  { id: '3', match: 'vs FlyQuest', date: 'Jan 22', hasRecording: false }
];

const players = ['All', 'Blaber', 'Fudge', 'Jojopyun', 'Berserker', 'Zven'];

export default function TrainingScheduler() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drills, setDrills] = useState<Drill[]>(initialDrills);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [showNewDrill, setShowNewDrill] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showDrillProgress, setShowDrillProgress] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [newDrill, setNewDrill] = useState({
    title: '',
    assignedTo: 'All',
    linkedMatch: '',
  });
  const [newSession, setNewSession] = useState({
    match: '',
    date: '',
    time: '',
  });

  const handleCreateDrill = () => {
    if (!newDrill.title.trim()) {
      toast({ title: "Error", description: "Please enter a drill title", variant: "destructive" });
      return;
    }
    
    const drill: Drill = {
      id: Date.now().toString(),
      title: newDrill.title,
      assignedTo: [newDrill.assignedTo],
      status: 'not_started',
      linkedMatch: newDrill.linkedMatch || 'General Training',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setDrills(prev => [drill, ...prev]);
    setShowNewDrill(false);
    setNewDrill({ title: '', assignedTo: 'All', linkedMatch: '' });
    toast({ title: "Drill Created", description: `"${drill.title}" has been created.` });
  };

  const handleDeleteDrill = (id: string) => {
    setDrills(prev => prev.filter(d => d.id !== id));
    toast({ title: "Drill Deleted", description: "The drill has been removed." });
  };

  const handleViewProgress = (drill: Drill) => {
    setSelectedDrill(drill);
    setShowDrillProgress(true);
  };

  const handleStartDrill = (id: string) => {
    setDrills(prev => prev.map(d => d.id === id ? { ...d, status: 'in_progress' as const } : d));
    toast({ title: "Drill Started", description: "The drill is now in progress." });
  };

  const handleCompleteDrill = (id: string) => {
    setDrills(prev => prev.map(d => d.id === id ? { ...d, status: 'completed' as const } : d));
    setShowDrillProgress(false);
    toast({ title: "Drill Completed", description: "Great work! The drill has been marked as complete." });
  };

  const handleScheduleSession = () => {
    if (!newSession.match.trim() || !newSession.date.trim()) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    
    const session: Session = {
      id: Date.now().toString(),
      match: newSession.match,
      date: newSession.date,
      time: newSession.time || '10:00 AM',
      attendees: ['Coach'],
      agendaItems: 0
    };
    
    setSessions(prev => [session, ...prev]);
    setShowNewSession(false);
    setNewSession({ match: '', date: '', time: '' });
    toast({ title: "Session Scheduled", description: `VOD session for "${session.match}" has been scheduled.` });
  };

  const handleJoinSession = (session: Session) => {
    toast({ title: "Joining Session", description: `Joining VOD review for ${session.match}...` });
    navigate('/coach/vod');
  };

  const handleEditSession = (session: Session) => {
    toast({ title: "Edit Session", description: `Opening editor for ${session.match}...` });
  };

  const handleWatchRecording = (match: string) => {
    toast({ title: "Loading Recording", description: `Loading recording for ${match}...` });
    navigate('/coach/vod');
  };

  const handleAddEvent = () => {
    toast({ title: "Add Event", description: "Calendar event creation coming soon!" });
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
            TRAINING SCHEDULER
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage drills, VOD sessions, and team training
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="drills" className="w-full">
        <TabsList className="bg-secondary/50 border border-primary/20">
          <TabsTrigger value="drills" className="data-[state=active]:bg-primary/20">
            <Dumbbell className="w-4 h-4 mr-2" />
            Drills
          </TabsTrigger>
          <TabsTrigger value="vod" className="data-[state=active]:bg-primary/20">
            <Video className="w-4 h-4 mr-2" />
            Team VOD Sessions
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-primary/20">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drills" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-foreground">ACTIVE DRILLS</h2>
            <Button onClick={() => setShowNewDrill(true)} className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Create New Drill
            </Button>
          </div>

          <div className="space-y-4">
            {drills.filter(d => d.status !== 'completed').map((drill, index) => (
              <motion.div
                key={drill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-5 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {drill.status === 'in_progress' ? (
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Dumbbell className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-foreground">{drill.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assigned to: <span className="text-primary">{drill.assignedTo.join(', ')}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Linked to: {drill.linkedMatch}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-xs font-mono",
                      drill.status === 'in_progress' 
                        ? "bg-primary/20 text-primary" 
                        : "bg-secondary/50 text-muted-foreground"
                    )}>
                      {drill.status === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toast({ title: "Edit Drill", description: "Drill editor coming soon!" })}
                    >
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteDrill(drill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {drill.status === 'not_started' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-primary/30"
                        onClick={() => handleStartDrill(drill.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-primary/30"
                        onClick={() => handleViewProgress(drill)}
                      >
                        View Progress <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vod" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-foreground">UPCOMING SESSIONS</h2>
            <Button onClick={() => setShowNewSession(true)} className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Session
            </Button>
          </div>

          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{session.match}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {session.date} at {session.time}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {session.attendees.length} attendees
                        </span>
                      </div>
                      <p className="text-sm text-primary mt-2">{session.agendaItems} agenda items prepared</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="border-primary/30"
                      onClick={() => handleEditSession(session)}
                    >
                      Edit
                    </Button>
                    <Button 
                      className="bg-primary hover:bg-primary/80"
                      onClick={() => handleJoinSession(session)}
                    >
                      Join Session
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-4">COMPLETED SESSIONS</h2>
            <div className="space-y-2">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-status-success" />
                    <span className="text-foreground">{session.match}</span>
                    <span className="text-sm text-muted-foreground">{session.date}</span>
                  </div>
                  {session.hasRecording && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary"
                      onClick={() => handleWatchRecording(session.match)}
                    >
                      Watch Recording
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6 text-center"
          >
            <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Calendar View</h2>
            <p className="text-muted-foreground mb-6">
              Interactive calendar coming soon. View and manage all team events in one place.
            </p>
            <Button onClick={handleAddEvent} className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* New Drill Dialog */}
      <Dialog open={showNewDrill} onOpenChange={setShowNewDrill}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create New Drill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Drill Title</label>
              <Input 
                value={newDrill.title}
                onChange={(e) => setNewDrill(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Baron Positioning Drill"
                className="bg-secondary/50 border-primary/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Assign To</label>
              <Select value={newDrill.assignedTo} onValueChange={(v) => setNewDrill(prev => ({ ...prev, assignedTo: v }))}>
                <SelectTrigger className="bg-secondary/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {players.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Linked To (optional)</label>
              <Input 
                value={newDrill.linkedMatch}
                onChange={(e) => setNewDrill(prev => ({ ...prev, linkedMatch: e.target.value }))}
                placeholder="e.g., Match vs TL, Baron contest"
                className="bg-secondary/50 border-primary/20"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowNewDrill(false)} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleCreateDrill} className="bg-primary hover:bg-primary/90">
              Create Drill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Session Dialog */}
      <Dialog open={showNewSession} onOpenChange={setShowNewSession}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Schedule VOD Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Session Title</label>
              <Input 
                value={newSession.match}
                onChange={(e) => setNewSession(prev => ({ ...prev, match: e.target.value }))}
                placeholder="e.g., Cloud9 vs TL Review"
                className="bg-secondary/50 border-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                <Input 
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Time</label>
                <Input 
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowNewSession(false)} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleScheduleSession} className="bg-primary hover:bg-primary/90">
              Schedule Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drill Progress Dialog */}
      <Dialog open={showDrillProgress} onOpenChange={setShowDrillProgress}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{selectedDrill?.title}</DialogTitle>
          </DialogHeader>
          {selectedDrill && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Assigned to</p>
                <p className="font-medium text-primary">{selectedDrill.assignedTo.join(', ')}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">Linked to</p>
                <p className="font-medium text-foreground">{selectedDrill.linkedMatch}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Progress</p>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full w-2/3 transition-all" />
                </div>
                <p className="text-sm text-primary mt-2">67% Complete</p>
              </div>
              <Button 
                onClick={() => handleCompleteDrill(selectedDrill.id)}
                className="w-full bg-status-success hover:bg-status-success/90"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
