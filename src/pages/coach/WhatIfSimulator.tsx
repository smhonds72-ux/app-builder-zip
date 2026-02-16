import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Play,
  RotateCcw,
  Save,
  Dumbbell,
  Brain,
  Activity,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dataService } from '@/lib/dataService';
import { useDataMode } from '@/contexts/DataContext';

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
  const { isLiveMode } = useDataMode();
  const [selectedEvent, setSelectedEvent] = useState(criticalEvents[0]);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [teamMetrics, setTeamMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSimulationData = async () => {
      if (isLiveMode) {
        try {
          setLoading(true);
          console.log('🧮 What-If Simulator: Fetching enhanced data...');
          
          const enhancedTeamStats = await dataService.getEnhancedTeamStats();
          
          setTeamMetrics(enhancedTeamStats);
          console.log('✅ What-If Simulator: Enhanced data loaded successfully');
        } catch (error) {
          console.error('❌ What-If Simulator: Error fetching enhanced data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSimulationData();
  }, [isLiveMode]);

  // Calculate actual win probability based on live data
  const actualWinProb = teamMetrics ? 
    Math.round((1 - teamMetrics.dsvTeam) * 50 + teamMetrics.opeTeam * 30) : 42.0;
  
  // Calculate alternative win probability based on selected alternative
  const getAlternativeWinProb = (alternativeId: string) => {
    if (!teamMetrics) return 60.2;
    
    // Base probabilities for different alternatives
    const baseProbabilities: { [key: string]: number } = {
      '1': 65.5, // Concede Baron, take mid inhibitor
      '2': 58.3, // Split push bot lane  
      '3': 72.1, // Reset and defend base
      '4': 45.8, // Contest with only 4 players
    };
    
    // Adjust based on team metrics
    const baseProb = baseProbabilities[alternativeId] || 60.2;
    const adjustment = (teamMetrics.tempoLeakTeam * -10) + (teamMetrics.opeTeam * 5);
    
    return Math.max(20, Math.min(85, baseProb + adjustment));
  };
  
  const alternativeWinProb = selectedAlternative ? 
    getAlternativeWinProb(selectedAlternative) : 60.2;
  
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
            {isLiveMode && teamMetrics && (
              <span className="ml-2 text-xs text-primary font-mono">
                (LIVE DATA: DSV {teamMetrics.dsvTeam.toFixed(2)}, OPE {(teamMetrics.opeTeam * 100).toFixed(0)}%)
              </span>
            )}
          </p>
        </div>
        
        {isLiveMode && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <Brain className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-green-400">LIVE CALCULATIONS ACTIVE</span>
          </div>
        )}
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
              <h3 className="text-sm font-mono text-muted-foreground mb-2">
                ACTUAL DECISION
                {isLiveMode && teamMetrics && (
                  <span className="block text-xs text-primary mt-1">
                    Based on DSV: {teamMetrics.dsvTeam.toFixed(2)}, OPE: {(teamMetrics.opeTeam * 100).toFixed(0)}%
                  </span>
                )}
              </h3>
              <p className="text-5xl font-display font-bold text-destructive">{actualWinProb}%</p>
              <p className="text-sm text-muted-foreground mt-2">Win Probability</p>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="w-10 h-10 text-primary animate-pulse" />
              {isLiveMode && (
                <div className="text-xs text-primary font-mono text-center mt-2">
                  Δ = {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                  <br />
                  <span className={cn(
                    "text-xs",
                    delta > 0 ? "text-status-success" : 
                    delta < 0 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {delta > 0 ? 'IMPROVEMENT' : delta < 0 ? 'RISK' : 'NEUTRAL'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-center p-6 rounded-xl bg-status-success/10 border border-status-success/30">
              <h3 className="text-sm font-mono text-muted-foreground mb-2">
                ALTERNATIVE SCENARIO
                {isLiveMode && selectedAlternative && teamMetrics && (
                  <span className="block text-xs text-primary mt-1">
                    {alternativeDecisions.find(alt => alt.id === selectedAlternative)?.name}
                  </span>
                )}
              </h3>
              <p className="text-5xl font-display font-bold text-status-success">{alternativeWinProb}%</p>
              <p className="text-sm text-muted-foreground mt-2">Win Probability</p>
              {isLiveMode && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs text-primary font-mono">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-3 h-3" />
                      <span>DSV Impact: {(selectedAlternative ? getAlternativeWinProb(selectedAlternative) - 60.2 : 0).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3 h-3" />
                      <span>OPE Multiplier: {teamMetrics ? (teamMetrics.opeTeam * 1.2).toFixed(2) : '1.00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3 h-3" />
                      <span>Tempo Factor: {teamMetrics ? (1 - teamMetrics.tempoLeakTeam).toFixed(2) : '1.00'}</span>
                    </div>
                  </div>
                </div>
              )}
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
