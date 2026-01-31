import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Play,
  RotateCcw,
  Save,
  Dumbbell
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const criticalEvents = [
  { id: '1', name: 'Baron Contest at 28:30', dsv: -18.5, match: 'vs Team Liquid' },
  { id: '2', name: 'Mid Tower Trade at 18:45', dsv: -12.3, match: 'vs Team Liquid' },
  { id: '3', name: 'First Drake at 8:20', dsv: +8.7, match: 'vs Team Liquid' },
  { id: '4', name: 'Team Fight at 22:15', dsv: -8.2, match: 'vs FlyQuest' },
];

const alternativeDecisions = [
  { id: '1', name: 'Concede Baron, take mid inhibitor' },
  { id: '2', name: 'Split push bot lane' },
  { id: '3', name: 'Reset and defend base' },
  { id: '4', name: 'Contest with only 4 players' },
];

export default function WhatIfSimulator() {
  const [selectedEvent, setSelectedEvent] = useState(criticalEvents[0]);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);

  const actualWinProb = 42.0;
  const alternativeWinProb = 60.2;
  const delta = alternativeWinProb - actualWinProb;

  const handleSimulate = () => {
    setSimulated(true);
  };

  const handleReset = () => {
    setSimulated(false);
    setSelectedAlternative(null);
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
            WHAT-IF SIMULATOR
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore alternative decisions and their impact on win probability
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-mono text-primary">AI-POWERED PREDICTIONS</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            STEP 1: SELECT CRITICAL EVENT
          </h2>
          
          <div className="space-y-3">
            {criticalEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setSimulated(false);
                }}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  selectedEvent.id === event.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-primary/10 bg-secondary/20 hover:bg-secondary/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.match}</p>
                  </div>
                  <span className={cn(
                    "font-mono text-lg font-bold",
                    event.dsv > 0 ? "text-status-success" : "text-destructive"
                  )}>
                    {event.dsv > 0 ? '+' : ''}{event.dsv}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            STEP 2: DEFINE ALTERNATIVE DECISION
          </h2>
          
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
            <h3 className="font-medium text-foreground mb-2">ACTUAL DECISION:</h3>
            <p className="text-muted-foreground">"Contested Baron with full team commit"</p>
            <p className="text-sm text-destructive mt-2">Result: Baron stolen, 3 deaths</p>
            <p className="text-sm text-muted-foreground">Win Probability: 42.0% → 23.5%</p>
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">ALTERNATIVE DECISION:</label>
            <Select 
              value={selectedAlternative || undefined}
              onValueChange={(value) => {
                setSelectedAlternative(value);
                setSimulated(false);
              }}
            >
              <SelectTrigger className="bg-secondary/50 border-primary/20">
                <SelectValue placeholder="Choose an alternative..." />
              </SelectTrigger>
              <SelectContent>
                {alternativeDecisions.map((alt) => (
                  <SelectItem key={alt.id} value={alt.id}>{alt.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSimulate}
              disabled={!selectedAlternative}
              className="w-full bg-primary hover:bg-primary/80"
            >
              <Play className="w-4 h-4 mr-2" />
              Simulate Alternative
            </Button>
          </div>
        </motion.div>
      </div>

      {simulated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            STEP 3: RESULTS COMPARISON
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 rounded-xl bg-destructive/10 border border-destructive/30">
              <h3 className="text-sm font-mono text-muted-foreground mb-2">ACTUAL DECISION</h3>
              <p className="text-5xl font-display font-bold text-destructive">{actualWinProb}%</p>
              <p className="text-sm text-muted-foreground mt-2">Win Probability After</p>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="w-10 h-10 text-primary animate-pulse" />
            </div>
            
            <div className="text-center p-6 rounded-xl bg-status-success/10 border border-status-success/30">
              <h3 className="text-sm font-mono text-muted-foreground mb-2">ALTERNATIVE SCENARIO</h3>
              <p className="text-5xl font-display font-bold text-status-success">{alternativeWinProb}%</p>
              <p className="text-sm text-muted-foreground mt-2">Win Probability After</p>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-status-success/20 border border-status-success/40">
              <TrendingUp className="w-6 h-6 text-status-success" />
              <span className="text-2xl font-display font-bold text-status-success">
                WIN PROBABILITY DELTA: +{delta.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-secondary/30 border border-primary/20 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground mb-2">HENRY'S ANALYSIS:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  "Conceding Baron and trading for mid inhibitor would have been the superior 
                  macro play. Here's why:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                    Avoided 3 deaths (-900g each)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                    Secured mid inhibitor (+200 map control)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                    Maintained wave pressure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                    Enemy Baron only lasted 90 seconds
                  </li>
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  Net advantage: ~{delta.toFixed(1)}% win probability."
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary hover:bg-primary/80">
              <Dumbbell className="w-4 h-4 mr-2" />
              Create Drill Based on This
            </Button>
            <Button variant="outline" className="border-primary/30">
              <Save className="w-4 h-4 mr-2" />
              Add to Agenda
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another Scenario
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
