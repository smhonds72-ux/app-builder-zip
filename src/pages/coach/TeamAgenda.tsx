import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Trash2,
  Save,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface AgendaItem {
  id: string;
  priority: number;
  title: string;
  dsv: number;
  timestamp: string;
  description: string;
  notes: string;
}

const initialAgendaItems: AgendaItem[] = [
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(initialAgendaItems);
  const [coachNotes, setCoachNotes] = useState("Focus on Baron positioning - JAX needs to maintain better proximity to pit. Team coordination on objective calls needs work.");
  const [isSaving, setIsSaving] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    timestamp: '',
    description: '',
    dsv: 0,
  });

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your agenda is being exported...",
    });
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Team agenda PDF has been downloaded.",
      });
    }, 1500);
  };

  const handleScheduleSession = () => {
    navigate('/coach/training');
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    toast({
      title: "Analyzing Match",
      description: "AI is identifying key moments...",
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAgendaItem: AgendaItem = {
      id: Date.now().toString(),
      priority: agendaItems.length + 1,
      title: 'Vision Setup Before Dragon at 14:00',
      dsv: -6.8,
      timestamp: '14:00',
      description: 'Team vision setup was late, leading to risky face-check. Could have been punished.',
      notes: ''
    };
    
    setAgendaItems(prev => [...prev, newAgendaItem]);
    setIsGenerating(false);
    toast({
      title: "Analysis Complete",
      description: "1 new agenda item has been added.",
    });
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }
    
    const item: AgendaItem = {
      id: Date.now().toString(),
      priority: agendaItems.length + 1,
      title: newItem.title,
      dsv: newItem.dsv,
      timestamp: newItem.timestamp || '00:00',
      description: newItem.description,
      notes: ''
    };
    
    setAgendaItems(prev => [...prev, item]);
    setShowNewItem(false);
    setNewItem({ title: '', timestamp: '', description: '', dsv: 0 });
    toast({ title: "Item Added", description: "Agenda item has been added." });
  };

  const handleEditItem = (item: AgendaItem) => {
    setSelectedItem(item);
    setShowEditItem(true);
  };

  const handleSaveEdit = () => {
    if (!selectedItem) return;
    setAgendaItems(prev => prev.map(i => i.id === selectedItem.id ? selectedItem : i));
    setShowEditItem(false);
    toast({ title: "Item Updated", description: "Agenda item has been saved." });
  };

  const handleDeleteItem = (id: string) => {
    setAgendaItems(prev => prev.filter(i => i.id !== id));
    toast({ title: "Item Deleted", description: "Agenda item has been removed." });
  };

  const handleViewVOD = (timestamp: string) => {
    toast({
      title: "Opening VOD",
      description: `Loading video at timestamp ${timestamp}...`,
    });
    navigate('/coach/vod');
  };

  const handleRunWhatIf = (item: AgendaItem) => {
    toast({
      title: "Loading Simulator",
      description: `Setting up What-If scenario for "${item.title}"...`,
    });
    navigate('/coach/what-if');
  };

  const handleSaveAgenda = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: "Agenda Saved",
      description: "Your changes have been saved successfully.",
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
            TEAM REVIEW AGENDA
          </h1>
          <p className="text-muted-foreground mt-1">
            Cloud9 vs Team Liquid | March 15, 2026
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleExportPDF} variant="outline" className="border-primary/30">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleScheduleSession} className="bg-primary hover:bg-primary/80">
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:bg-primary/10"
              onClick={handleAutoGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Auto-Generate More
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30"
              onClick={() => setShowNewItem(true)}
            >
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary/30 text-primary"
                      onClick={() => handleViewVOD(item.timestamp)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      View in 3D VOD
                    </Button>
                    {item.dsv < 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-primary/30 text-primary"
                        onClick={() => handleRunWhatIf(item)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Run What-If
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteItem(item.id)}
                    >
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
          value={coachNotes}
          onChange={(e) => setCoachNotes(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleSaveAgenda}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/80"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Agenda
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* New Item Dialog */}
      <Dialog open={showNewItem} onOpenChange={setShowNewItem}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add Agenda Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Title</label>
              <Input 
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Baron Contest at 28:30"
                className="bg-secondary/50 border-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Timestamp</label>
                <Input 
                  value={newItem.timestamp}
                  onChange={(e) => setNewItem(prev => ({ ...prev, timestamp: e.target.value }))}
                  placeholder="e.g., 28:30"
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">DSV Impact (%)</label>
                <Input 
                  type="number"
                  value={newItem.dsv}
                  onChange={(e) => setNewItem(prev => ({ ...prev, dsv: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g., -15.5"
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Description</label>
              <Textarea 
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happened..."
                className="bg-secondary/50 border-primary/20"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowNewItem(false)} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
        <DialogContent className="bg-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Agenda Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                <Input 
                  value={selectedItem.title}
                  onChange={(e) => setSelectedItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                <Textarea 
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Notes</label>
                <Textarea 
                  value={selectedItem.notes}
                  onChange={(e) => setSelectedItem(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  placeholder="Add notes for this item..."
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowEditItem(false)} className="border-primary/30">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
