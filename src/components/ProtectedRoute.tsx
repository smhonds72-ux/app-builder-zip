import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to={`/auth/login?redirect=${location.pathname}`} replace />;
  }

  // Check role-based access
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to appropriate portal based on actual role
    if (profile.role === 'coach') {
      return <Navigate to="/coach" replace />;
    } else {
      return <Navigate to="/player" replace />;
    }
  }

  return <>{children}</>;
}
