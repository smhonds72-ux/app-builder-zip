import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  ChevronRight,
  Plus,
  Video,
  Sparkles,
  Download,
  Calendar,
  Edit3,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const agendaItems = [
  {
    id: '1',
    priority: 1,
    title: 'Baron Contest at 28:30',
    dsv: -18.5,
    timestamp: '28:30',
    description: 'Team lost Baron fight despite gold advantage. Coordination issues between top and jungle.',
    notes: ''
  },
  {
    id: '2',
    priority: 2,
    title: 'Mid Tower Trade at 18:45',
    dsv: -12.3,
    timestamp: '18:45',
    description: 'Traded mid tower for enemy jungle camps - suboptimal value exchange.',
    notes: ''
  },
  {
    id: '3',
    priority: 3,
    title: 'First Drake Secure at 8:20',
    dsv: +8.7,
    timestamp: '8:20',
    description: 'Clean objective setup with vision control. Good example to replicate.',
    notes: ''
  },
  {
    id: '4',
    priority: 4,
    title: 'Bot Lane 2v2 at 12:15',
    dsv: +5.2,
    timestamp: '12:15',
    description: 'Won 2v2 despite being in weak side. Strong mechanical execution.',
    notes: ''
  }
];

export default function TeamAgenda() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            TEAM REVIEW AGENDA
          </h1>
          <p className="text-muted-foreground mt-1">
            Cloud9 vs Team Liquid | March 15, 2026
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/30">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule VOD Session
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-destructive/30 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Result</p>
          <p className="text-2xl font-display font-bold text-destructive">LOSS</p>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="text-2xl font-display font-bold text-foreground">34:22</p>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Net DSV</p>
          <p className="text-2xl font-display font-bold text-destructive">-16.9</p>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Agenda Items</p>
          <p className="text-2xl font-display font-bold text-foreground">{agendaItems.length}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">AGENDA ITEMS</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Auto-Generate More
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30">
              <Plus className="w-4 h-4 mr-2" />
              Add Manual Item
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {agendaItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={cn(
                "p-5 rounded-xl border transition-all hover:bg-secondary/20",
                item.dsv < -10 && "border-destructive/40 bg-destructive/5",
                item.dsv >= -10 && item.dsv < 0 && "border-status-warning/40 bg-status-warning/5",
                item.dsv >= 0 && "border-status-success/40 bg-status-success/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold",
                  item.dsv < -10 && "bg-destructive/20 text-destructive",
                  item.dsv >= -10 && item.dsv < 0 && "bg-status-warning/20 text-status-warning",
                  item.dsv >= 0 && "bg-status-success/20 text-status-success"
                )}>
                  {item.priority}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-2xl font-mono font-bold",
                        item.dsv > 0 ? "text-status-success" : "text-destructive"
                      )}>
                        {item.dsv > 0 ? '+' : ''}{item.dsv}%
                      </span>
                      <p className="text-sm text-muted-foreground flex items-center justify-end gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary">
                      <Video className="w-4 h-4 mr-2" />
                      View in 3D VOD
                    </Button>
                    {item.dsv < 0 && (
                      <Button variant="outline" size="sm" className="border-primary/30 text-primary">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Run What-If
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-display font-bold text-foreground mb-4">COACH NOTES</h2>
        <Textarea 
          placeholder="Add your notes for this review session..."
          className="min-h-32 bg-secondary/30 border-primary/20 resize-none"
          defaultValue="Focus on Baron positioning - JAX needs to maintain better proximity to pit. Team coordination on objective calls needs work."
        />
        <div className="flex justify-end mt-4">
          <Button className="bg-primary hover:bg-primary/80">
            Save Agenda
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
