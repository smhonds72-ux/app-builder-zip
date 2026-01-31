import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function PlayerHeader() {
  return (
    <header className="h-16 border-b border-brand-blue/20 bg-card/30 backdrop-blur-xl px-6 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search stats, drills, VODs..." 
            className="pl-10 bg-secondary/50 border-brand-blue/20 focus:border-brand-blue/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-muted-foreground hover:text-foreground hover:bg-brand-blue/10"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-brand-blue/20">
          <Avatar className="w-9 h-9 border-2 border-brand-blue/30">
            <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-display text-sm">
              JX
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">Jax</p>
            <p className="text-xs text-muted-foreground font-mono">Top Laner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
