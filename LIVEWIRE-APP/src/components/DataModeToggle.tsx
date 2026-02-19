import { Database, Server, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useDataMode } from '@/contexts/DataContext';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import LiveModeNotification from '@/components/LiveModeNotification';

export function DataModeToggle() {
  const { dataMode, setDataMode, isLiveMode, refreshData } = useDataMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleRefresh = async () => {
    if (!isLiveMode) return;
    
    setIsRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleModeChange = (checked: boolean) => {
    if (checked && !isLiveMode) {
      // Show notification when enabling live mode
      setShowNotification(true);
    } else {
      setDataMode(checked ? 'live' : 'mock');
    }
  };

  const handleNotificationComplete = () => {
    setDataMode('live');
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-primary/20">
            <Database className={`w-4 h-4 ${!isLiveMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
              checked={isLiveMode}
              onCheckedChange={handleModeChange}
              className="data-[state=checked]:bg-status-success"
            />
            <Server className={`w-4 h-4 ${isLiveMode ? 'text-status-success' : 'text-muted-foreground'}`} />
            <span className="text-xs font-mono text-muted-foreground ml-1">
              {dataMode.toUpperCase()}
            </span>
            {isLiveMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-6 w-6 p-0 ml-1"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLiveMode ? 'Using live data from GRID API' : 'Using mock/demo data'}</p>
          {isLiveMode && <p className="text-xs text-muted-foreground">Click refresh to update data</p>}
        </TooltipContent>
      </Tooltip>
      
      {/* Live Mode Notification */}
      <LiveModeNotification
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        onComplete={handleNotificationComplete}
      />
    </>
  );
}
