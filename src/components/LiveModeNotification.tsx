import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Trophy, 
  CheckCircle, 
  Loader2,
  Zap
} from 'lucide-react';
import { gridAPI } from '@/lib/gridAPI';
import { useToast } from '@/hooks/use-toast';
import { useDataMode } from '@/contexts/DataContext';

interface LiveSeries {
  id: string;
  title?: {
    nameShortened?: string;
  };
  tournament?: {
    nameShortened?: string;
  };
  startTimeScheduled?: string;
  format?: {
    name?: string;
  };
  teams?: {
    baseInfo?: {
      name?: string;
    };
    scoreAdvantage?: number;
  }[];
}

interface LiveModeNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function LiveModeNotification({ isOpen, onClose, onComplete }: LiveModeNotificationProps) {
  const [step, setStep] = useState<'loading' | 'selection' | 'complete'>('loading');
  const [liveSeries, setLiveSeries] = useState<LiveSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setSelectedSeries } = useDataMode();

  useEffect(() => {
    if (isOpen && step === 'loading') {
      fetchLiveSeries();
    }
  }, [isOpen, step]);

  const fetchLiveSeries = async () => {
    setLoading(true);
    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { series } = await gridAPI.getLiveSeries();
      setLiveSeries(series);
      setStep('selection');
    } catch (error) {
      console.error('Error fetching live series:', error);
      toast({
        title: "Error",
        description: "Failed to fetch live series. Please try again.",
        variant: "destructive"
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const selectSeries = async (series: LiveSeries) => {
    setLoading(true);
    try {
      // Store selected series in context and localStorage
      setSelectedSeries(series);
      localStorage.setItem('selectedSeries', JSON.stringify(series));
      
      // Simulate setup process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('complete');
      
      // Auto-close after showing completion message
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error setting up live mode:', error);
      toast({
        title: "Error", 
        description: "Failed to setup live mode. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-xl border-primary/30 shadow-2xl">
              <CardContent className="p-6">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Loading Step */}
                {step === 'loading' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Activity className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Loading Live Series Data</h3>
                        <p className="text-sm text-muted-foreground">Fetching available live series...</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">
                          🔄 Loading Live Series Data...
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                          📊 Fetching available live series from GRID API...
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={loading ? 66 : 33} className="w-full" />
                  </div>
                )}

                {/* Selection Step */}
                {step === 'selection' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/20">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Select Live Series</h3>
                        <p className="text-sm text-muted-foreground">
                          🏆 Select Live Series ({liveSeries.length} options available)
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {liveSeries.map((series) => (
                        <Card 
                          key={series.id}
                          className="cursor-pointer hover:bg-accent/50 transition-colors border-primary/20"
                          onClick={() => selectSeries(series)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {series.title?.nameShortened || `Series ${series.id}`}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {series.tournament?.nameShortened || 'Unknown Tournament'}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {series.id}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete Step */}
                {step === 'complete' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Setup Complete</h3>
                        <p className="text-sm text-muted-foreground">
                          Live Mode Setup Completed Successfully
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        Real analytics formulas are now active
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {step === 'selection' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
