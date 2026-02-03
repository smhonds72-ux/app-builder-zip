import { Database, Server } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useDataMode } from '@/contexts/DataContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DataModeToggle() {
  const { dataMode, setDataMode, isLiveMode } = useDataMode();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-primary/20">
          <Database className={`w-4 h-4 ${!isLiveMode ? 'text-primary' : 'text-muted-foreground'}`} />
          <Switch
            checked={isLiveMode}
            onCheckedChange={(checked) => setDataMode(checked ? 'live' : 'mock')}
            className="data-[state=checked]:bg-status-success"
          />
          <Server className={`w-4 h-4 ${isLiveMode ? 'text-status-success' : 'text-muted-foreground'}`} />
          <span className="text-xs font-mono text-muted-foreground ml-1">
            {dataMode.toUpperCase()}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isLiveMode ? 'Using live data from GRID API' : 'Using mock/demo data'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
