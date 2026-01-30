import { motion } from 'framer-motion';
import { Video, Play, Clock, Calendar, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface VOD {
  id: string;
  title: string;
  opponent: string;
  game: 'LoL' | 'VALORANT';
  result: 'win' | 'loss';
  duration: string;
  date: string;
  thumbnail?: string;
  reviewed: boolean;
  notes?: number;
}

const vods: VOD[] = [
  { id: '1', title: 'LCS Week 6 - Game 1', opponent: 'Team Liquid', game: 'LoL', result: 'win', duration: '42:18', date: 'Jan 28, 2026', reviewed: true, notes: 12 },
  { id: '2', title: 'LCS Week 6 - Game 2', opponent: 'Team Liquid', game: 'LoL', result: 'win', duration: '38:45', date: 'Jan 28, 2026', reviewed: true, notes: 8 },
  { id: '3', title: 'LCS Week 6 - Game 3', opponent: 'Team Liquid', game: 'LoL', result: 'loss', duration: '45:22', date: 'Jan 28, 2026', reviewed: false },
  { id: '4', title: 'Scrim vs FlyQuest', opponent: 'FlyQuest', game: 'LoL', result: 'win', duration: '35:10', date: 'Jan 27, 2026', reviewed: false },
  { id: '5', title: 'Scrim vs FlyQuest', opponent: 'FlyQuest', game: 'LoL', result: 'win', duration: '31:55', date: 'Jan 27, 2026', reviewed: false },
  { id: '6', title: 'LCS Week 5 - Game 1', opponent: '100 Thieves', game: 'LoL', result: 'loss', duration: '48:30', date: 'Jan 21, 2026', reviewed: true, notes: 15 },
];

export default function VODReview() {
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
            VOD REVIEW
          </h1>
          <p className="text-muted-foreground mt-1">
            Match recordings and AI-assisted analysis
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search VODs..."
              className="w-64 pl-10 bg-secondary/50 border-primary/20"
            />
          </div>
          <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total VODs', value: '156', icon: Video },
          { label: 'Reviewed', value: '142', icon: Play },
          { label: 'Pending Review', value: '14', icon: Clock },
          { label: 'This Month', value: '24', icon: Calendar },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="p-4 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30 flex items-center gap-4"
          >
            <div className="p-3 rounded-lg bg-primary/20">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* VOD Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {vods.map((vod, index) => (
          <motion.div
            key={vod.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className={cn(
              "group rounded-xl overflow-hidden cursor-pointer",
              "bg-card/50 backdrop-blur-xl border",
              vod.result === 'win' ? "border-status-success/20" : "border-destructive/20",
              "hover:shadow-lg transition-all duration-300"
            )}
          >
            {/* Thumbnail */}
            <div className="relative h-40 bg-secondary/50 flex items-center justify-center">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <Video className="w-12 h-12 text-muted-foreground/50" />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-4 rounded-full bg-primary/90">
                  <Play className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-xs font-mono text-foreground">
                {vod.duration}
              </div>

              {/* Result badge */}
              <div className={cn(
                "absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold uppercase",
                vod.result === 'win' 
                  ? "bg-status-success/90 text-white" 
                  : "bg-destructive/90 text-white"
              )}>
                {vod.result}
              </div>

              {/* Reviewed badge */}
              {vod.reviewed && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-primary/90 text-xs font-medium text-primary-foreground">
                  Reviewed
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-foreground mb-1">{vod.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>vs {vod.opponent}</span>
                <span>{vod.date}</span>
              </div>
              {vod.notes && (
                <div className="mt-2 text-xs text-primary">
                  {vod.notes} notes attached
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
