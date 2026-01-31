import { motion } from 'framer-motion';
import { Video, Calendar, Users, Clock, Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const upcomingSessions = [
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

const completedSessions = [
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
                        {session.attendees.length} attendees
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm text-brand-blue">{session.agendaItems} agenda items prepared</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-brand-blue hover:bg-brand-blue/80">
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
                <Button variant="outline" className="border-brand-blue/30 text-brand-blue">
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
    </div>
  );
}
