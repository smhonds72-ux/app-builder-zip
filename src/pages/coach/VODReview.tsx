import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Play, Clock, Calendar, Filter, Search, X, Plus, Trash2 } from 'lucide-react';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

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

const initialVods: VOD[] = [
  { id: '1', title: 'LCS Week 6 - Game 1', opponent: 'Team Liquid', game: 'LoL', result: 'win', duration: '42:18', date: 'Jan 28, 2026', reviewed: true, notes: 12 },
  { id: '2', title: 'LCS Week 6 - Game 2', opponent: 'Team Liquid', game: 'LoL', result: 'win', duration: '38:45', date: 'Jan 28, 2026', reviewed: true, notes: 8 },
  { id: '3', title: 'LCS Week 6 - Game 3', opponent: 'Team Liquid', game: 'LoL', result: 'loss', duration: '45:22', date: 'Jan 28, 2026', reviewed: false },
  { id: '4', title: 'Scrim vs FlyQuest', opponent: 'FlyQuest', game: 'LoL', result: 'win', duration: '35:10', date: 'Jan 27, 2026', reviewed: false },
  { id: '5', title: 'Scrim vs FlyQuest', opponent: 'FlyQuest', game: 'LoL', result: 'win', duration: '31:55', date: 'Jan 27, 2026', reviewed: false },
  { id: '6', title: 'LCS Week 5 - Game 1', opponent: '100 Thieves', game: 'LoL', result: 'loss', duration: '48:30', date: 'Jan 21, 2026', reviewed: true, notes: 15 },
];

export default function VODReview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vods, setVods] = useState<VOD[]>(initialVods);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVod, setSelectedVod] = useState<VOD | null>(null);
  const [showVodPlayer, setShowVodPlayer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    wins: true,
    losses: true,
    reviewed: true,
    pending: true,
  });
  const [newNote, setNewNote] = useState('');

  const filteredVods = vods.filter(vod => {
    const matchesSearch = vod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vod.opponent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResult = (filters.wins && vod.result === 'win') || (filters.losses && vod.result === 'loss');
    const matchesReview = (filters.reviewed && vod.reviewed) || (filters.pending && !vod.reviewed);
    return matchesSearch && matchesResult && matchesReview;
  });

  const handleVodClick = (vod: VOD) => {
    setSelectedVod(vod);
    setShowVodPlayer(true);
  };

  const handleMarkReviewed = (id: string) => {
    setVods(prev => prev.map(v => v.id === id ? { ...v, reviewed: true } : v));
    toast({
      title: "VOD Marked as Reviewed",
      description: "This VOD has been marked as reviewed.",
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedVod) return;
    
    setVods(prev => prev.map(v => 
      v.id === selectedVod.id 
        ? { ...v, notes: (v.notes || 0) + 1 } 
        : v
    ));
    setNewNote('');
    toast({
      title: "Note Added",
      description: "Your note has been saved to this VOD.",
    });
  };

  const handleCreateAgenda = (vod: VOD) => {
    toast({
      title: "Creating Agenda",
      description: `Creating team review agenda for ${vod.title}...`,
    });
    navigate('/coach/agenda');
  };

  const stats = {
    total: vods.length,
    reviewed: vods.filter(v => v.reviewed).length,
    pending: vods.filter(v => !v.reviewed).length,
    thisMonth: vods.filter(v => v.date.includes('Jan')).length,
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 bg-secondary/50 border-primary/20"
            />
          </div>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter VODs</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Wins</span>
                  <Switch 
                    checked={filters.wins}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, wins: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Losses</span>
                  <Switch 
                    checked={filters.losses}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, losses: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Reviewed</span>
                  <Switch 
                    checked={filters.reviewed}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, reviewed: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="font-medium">Show Pending</span>
                  <Switch 
                    checked={filters.pending}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, pending: checked }))}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total VODs', value: stats.total.toString(), icon: Video },
          { label: 'Reviewed', value: stats.reviewed.toString(), icon: Play },
          { label: 'Pending Review', value: stats.pending.toString(), icon: Clock },
          { label: 'This Month', value: stats.thisMonth.toString(), icon: Calendar },
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
        {filteredVods.map((vod, index) => (
          <motion.div
            key={vod.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            onClick={() => handleVodClick(vod)}
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

      {/* VOD Player Dialog */}
      <Dialog open={showVodPlayer} onOpenChange={setShowVodPlayer}>
        <DialogContent className="bg-card border-primary/30 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{selectedVod?.title}</DialogTitle>
          </DialogHeader>
          {selectedVod && (
            <div className="space-y-4 mt-4">
              {/* Video Player Placeholder */}
              <div className="relative aspect-video bg-secondary/50 rounded-lg flex items-center justify-center">
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="text-center">
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video playback would appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">Duration: {selectedVod.duration}</p>
                </div>
                <Button 
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/90 hover:bg-primary"
                  onClick={() => toast({ title: "Playing VOD", description: "Video playback started..." })}
                >
                  <Play className="w-8 h-8" fill="currentColor" />
                </Button>
              </div>

              {/* VOD Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Opponent</p>
                  <p className="font-medium text-foreground">{selectedVod.opponent}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Result</p>
                  <p className={cn(
                    "font-medium uppercase",
                    selectedVod.result === 'win' ? "text-status-success" : "text-destructive"
                  )}>{selectedVod.result}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{selectedVod.date}</p>
                </div>
              </div>

              {/* Add Note Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Add Note</label>
                <div className="flex gap-2">
                  <Textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this timestamp..."
                    className="bg-secondary/50 border-primary/20 flex-1"
                  />
                  <Button onClick={handleAddNote} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!selectedVod.reviewed && (
                  <Button 
                    variant="outline" 
                    className="flex-1 border-primary/30"
                    onClick={() => handleMarkReviewed(selectedVod.id)}
                  >
                    Mark as Reviewed
                  </Button>
                )}
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleCreateAgenda(selectedVod)}
                >
                  Create Team Agenda
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
