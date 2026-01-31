import { motion } from 'framer-motion';
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
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const activeDrills = [
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

const upcomingSessions = [
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

export default function TrainingScheduler() {
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
            <Button className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Create New Drill
            </Button>
          </div>

          <div className="space-y-4">
            {activeDrills.map((drill, index) => (
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
                    <Button variant="ghost" size="icon">
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/30">
                      View Progress <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vod" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-foreground">UPCOMING SESSIONS</h2>
            <Button className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Session
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
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
                    <Button variant="outline" className="border-primary/30">
                      Edit
                    </Button>
                    <Button className="bg-primary hover:bg-primary/80">
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
                    <Button variant="ghost" size="sm" className="text-primary">
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
            <Button className="bg-primary hover:bg-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
