import { 
  LayoutDashboard, 
  BarChart3, 
  Target,
  Video, 
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  TrendingUp
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { title: 'Dashboard', url: '/player', icon: LayoutDashboard },
  { title: 'Performance', url: '/player/performance', icon: TrendingUp },
  { title: 'My Drills', url: '/player/drills', icon: Dumbbell },
  { title: 'VOD Sessions', url: '/player/vod', icon: Video },
  { title: 'Leaks Analysis', url: '/player/leaks', icon: Target },
];

const secondaryNavItems = [
  { title: 'Settings', url: '/player/settings', icon: Settings },
];

export function PlayerSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      className={cn(
        "border-r border-brand-blue/20 bg-card/50 backdrop-blur-xl transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-brand-blue/20 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-blue blur-lg opacity-50 rounded-lg" />
            <div className="relative bg-gradient-to-br from-brand-blue to-primary p-2 rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground tracking-wide">LIVEWIRE</span>
              <span className="text-xs text-muted-foreground font-mono">PLAYER TERMINAL</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-mono text-muted-foreground mb-2 px-2">
              MY STATS
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/player'}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        "text-muted-foreground hover:text-foreground hover:bg-brand-blue/10",
                        "group relative overflow-hidden"
                      )}
                      activeClassName="bg-brand-blue/20 text-brand-blue border border-brand-blue/30 shadow-glow-blue"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/0 via-brand-blue/5 to-brand-blue/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pt-4 border-t border-brand-blue/10">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-mono text-muted-foreground mb-2 px-2">
              SYSTEM
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        "text-muted-foreground hover:text-foreground hover:bg-brand-blue/10"
                      )}
                      activeClassName="bg-brand-blue/20 text-brand-blue"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-brand-blue/20 p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground hover:bg-brand-blue/10"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => window.location.href = '/'}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
