import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataModeToggle } from '@/components/DataModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PlayerHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    // Use replace to prevent back navigation and ensure clean state
    navigate('/auth/login', { replace: true });
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'PL';
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
        {/* Data Mode Toggle */}
        <div className="hidden lg:block">
          <DataModeToggle />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-muted-foreground hover:text-foreground hover:bg-brand-blue/10"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-4 border-l border-brand-blue/20 cursor-pointer">
              <Avatar className="w-9 h-9 border-2 border-brand-blue/30">
                <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-display text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{profile?.full_name || 'Player'}</p>
                <p className="text-xs text-muted-foreground font-mono">{profile?.team_name || 'Player'}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-brand-blue/20">
            <DropdownMenuLabel className="font-display">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-brand-blue/20" />
            <DropdownMenuItem 
              className="hover:bg-brand-blue/10 cursor-pointer"
              onClick={() => navigate('/player/settings')}
            >
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-brand-blue/20" />
            <DropdownMenuItem 
              className="hover:bg-destructive/10 text-destructive cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
