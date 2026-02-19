import { motion } from 'framer-motion';
import { Video, Calendar, Users, Clock, Play, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Session {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration: string;
  attendees: string[] | number;
  agendaItems?: number;
  status?: string;
  recordingAvailable?: boolean;
}

const upcomingSessions: Session[] = [
  {
    id: '1',
    title: 'Team Review: vs Team Liquid',
    date: 'Tomorrow',
    time: '2:00 PM',
    duration: '60 min',
    attendees: ['Coach', 'Blaber', 'Fudge', 'Jax', 'Berserker'],
    agendaItems: 5,
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Individual Review: Lane Phase',
    date: 'Feb 2',
    time: '10:00 AM',
    duration: '30 min',
    attendees: ['Coach', 'Jax'],
    agendaItems: 3,
    status: 'scheduled'
  }
];

const completedSessions: Session[] = [
  {
    id: '3',
    title: 'Team Review: vs FlyQuest',
    date: 'Jan 28',
    duration: '55 min',
    attendees: 5,
    recordingAvailable: true
  },
  {
    id: '4',
    title: 'Baron Positioning Review',
    date: 'Jan 25',
    duration: '45 min',
    attendees: 3,
    recordingAvailable: true
  },
  {
    id: '5',
    title: 'Team Review: vs 100 Thieves',
    date: 'Jan 22',
    duration: '70 min',
    attendees: 5,
    recordingAvailable: false
  }
];

export default function PlayerVOD() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showWatchDialog, setShowWatchDialog] = useState(false);

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setShowDetailsDialog(true);
  };

  const handleWatchRecording = (session: Session) => {
    setSelectedSession(session);
    setShowWatchDialog(true);
  };

  const confirmJoinSession = () => {
    if (!selectedSession) return;
    
    setShowDetailsDialog(false);
    toast({
      title: "Session Added to Calendar",
      description: `You'll be notified 30 minutes before "${selectedSession.title}" starts.`,
    });
  };

  const startWatching = () => {
    if (!selectedSession) return;
    
    setShowWatchDialog(false);
    toast({
      title: "Loading Recording",
      description: `Starting playback for "${selectedSession.title}"...`,
    });
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
            VOD SESSIONS
          </h1>
          <p className="text-muted-foreground mt-1">
            Scheduled team reviews and recorded sessions
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-display font-bold text-foreground mb-6">UPCOMING SESSIONS</h2>
        
        <div className="space-y-4">
          {upcomingSessions.map((session, index) => (
            <div
              key={session.id}
              className="p-5 rounded-xl bg-secondary/30 border border-brand-blue/20 hover:border-brand-blue/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-brand-blue/20">
                    <Video className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-foreground">{session.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {session.date} at {session.time}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {Array.isArray(session.attendees) ? session.attendees.length : session.attendees} attendees
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm text-brand-blue">{session.agendaItems} agenda items prepared</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="bg-brand-blue hover:bg-brand-blue/80"
                  onClick={() => handleViewDetails(session)}
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-display font-bold text-foreground mb-6">COMPLETED SESSIONS</h2>
        
        <div className="space-y-3">
          {completedSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-brand-blue/10 hover:bg-secondary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Video className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{session.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">{session.date}</span>
                    <span className="text-sm text-muted-foreground">{session.duration}</span>
                    <span className="text-sm text-muted-foreground">{session.attendees} attendees</span>
                  </div>
                </div>
              </div>
              {session.recordingAvailable ? (
                <Button 
                  variant="outline" 
                  className="border-brand-blue/30 text-brand-blue"
                  onClick={() => handleWatchRecording(session)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Recording
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">No recording</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Session Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <DialogDescription>
              View session details and add to your calendar
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <p className="text-foreground font-medium mt-1">
                    {selectedSession.date} at {selectedSession.time}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p className="text-foreground font-medium mt-1">
                    {selectedSession.duration}
                  </p>
                </div>
              </div>
              
              {Array.isArray(selectedSession.attendees) && (
                <div className="p-4 rounded-lg bg-secondary/30">
                  <span className="text-sm text-muted-foreground">Attendees</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSession.attendees.map((attendee, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded bg-brand-blue/20 text-brand-blue text-sm"
                      >
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-4 rounded-lg bg-secondary/30">
                <span className="text-sm text-muted-foreground">Agenda Items</span>
                <p className="text-foreground font-medium mt-1">
                  {selectedSession.agendaItems} topics to discuss
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/80" onClick={confirmJoinSession}>
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Watch Recording Dialog */}
      <Dialog open={showWatchDialog} onOpenChange={setShowWatchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <DialogDescription>
              Recording from {selectedSession?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center border border-brand-blue/20">
              <div className="text-center">
                <Play className="w-16 h-16 text-brand-blue mx-auto mb-4" />
                <p className="text-muted-foreground">Click play to start watching</p>
                <p className="text-sm text-muted-foreground mt-1">Duration: {selectedSession?.duration}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWatchDialog(false)}>
              Close
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/80" onClick={startWatching}>
              <Play className="w-4 h-4 mr-2" />
              Start Playback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
