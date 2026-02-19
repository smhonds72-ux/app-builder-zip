import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PlayerSidebar } from './PlayerSidebar';
import { PlayerHeader } from './PlayerHeader';

export function PlayerLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-primary/5" />
        </div>
        
        <PlayerSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          <PlayerHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
