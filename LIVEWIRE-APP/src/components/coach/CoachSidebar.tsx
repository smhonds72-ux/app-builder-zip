import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Target, 
  Video, 
  MessageSquare,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Dumbbell
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
  { title: 'Command Center', url: '/coach', icon: LayoutDashboard },
  { title: 'Team Analytics', url: '/coach/analytics', icon: BarChart3 },
  { title: 'Players', url: '/coach/players', icon: Users },
  { title: 'Strategy Lab', url: '/coach/strategy', icon: Target },
  { title: 'What-If Simulator', url: '/coach/simulator', icon: Sparkles },
  { title: 'VOD Review', url: '/coach/vod', icon: Video },
  { title: 'Team Agenda', url: '/coach/agenda', icon: FileText },
  { title: 'Training', url: '/coach/training', icon: Dumbbell },
  { title: 'Coach Henry', url: '/coach/henry', icon: MessageSquare },
];

const secondaryNavItems = [
  { title: 'Settings', url: '/coach/settings', icon: Settings },
];

export function CoachSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      className={cn(
        "border-r border-primary/20 bg-card/50 backdrop-blur-xl transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-50 rounded-lg" />
            <div className="relative bg-gradient-to-br from-primary to-brand-blue p-2 rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground tracking-wide">LIVEWIRE</span>
              <span className="text-xs text-muted-foreground font-mono">COACH PORTAL</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-mono text-muted-foreground mb-2 px-2">
              MAIN SYSTEMS
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/coach'}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                        "group relative overflow-hidden"
                      )}
                      activeClassName="bg-primary/20 text-primary border border-primary/30 shadow-glow-cyan"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto pt-4 border-t border-primary/10">
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
                        "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      )}
                      activeClassName="bg-primary/20 text-primary"
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

      {/* Footer with collapse toggle */}
      <SidebarFooter className="border-t border-primary/20 p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
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
