import { Bell, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CoachHeader() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <header className="h-16 border-b border-primary/20 bg-card/30 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {state === 'collapsed' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search players, matches, strategies..."
            className="w-80 pl-10 bg-secondary/50 border-primary/20 focus:border-primary/50 placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* System Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-success/10 border border-status-success/30">
          <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-xs font-mono text-status-success">SYSTEMS ONLINE</span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-primary/10"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-brand-blue flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">Coach Demo</span>
                <span className="text-xs text-muted-foreground">Head Coach</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-primary/20">
            <DropdownMenuLabel className="font-display">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/20" />
            <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer">
              Notification Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/20" />
            <DropdownMenuItem 
              className="hover:bg-destructive/10 text-destructive cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
