import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CoachSidebar } from './CoachSidebar';
import { CoachHeader } from './CoachHeader';

export function CoachLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-blue/5" />
        </div>
        
        <CoachSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          <CoachHeader />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
