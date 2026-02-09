import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRole } from '@/lib/supabase';

// Mock user types for static auth
interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    role: UserRole;
    team_name?: string;
  };
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole, teamName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create mock profile from user
  const createMockProfile = (mockUser: MockUser): Profile => {
    const profile = {
      id: mockUser.id,
      email: mockUser.email,
      full_name: mockUser.user_metadata.full_name,
      role: mockUser.user_metadata.role,
      team_name: mockUser.user_metadata.team_name || null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log('🔧 Creating mock profile:', profile);
    return profile;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = createMockProfile(user);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Check for existing session in localStorage on app load
    const storedSession = localStorage.getItem('mockAuthSession');
    if (storedSession) {
      try {
        const mockSession: MockSession = JSON.parse(storedSession);
        console.log('Loading existing session:', mockSession);
        setSession(mockSession);
        setUser(mockSession.user);
        const mockProfile = createMockProfile(mockSession.user);
        setProfile(mockProfile);
        console.log('Loaded profile with role:', mockProfile.role);
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('mockAuthSession');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    teamName?: string
  ) => {
    // Static signup - just create mock user and session
    const mockUser: MockUser = {
      id: `mock-${Date.now()}`,
      email,
      user_metadata: {
        full_name: fullName,
        role,
        team_name: teamName,
      },
    };

    const mockSession: MockSession = {
      user: mockUser,
      access_token: `mock-token-${Date.now()}`,
    };

    // Store session
    localStorage.setItem('mockAuthSession', JSON.stringify(mockSession));
    setUser(mockUser);
    setSession(mockSession);
    setProfile(createMockProfile(mockUser));

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Static sign in attempt:', { email, password });
    
    // Static sign in - accept any credentials and create appropriate user
    let role: UserRole = 'player';
    let fullName = 'Test User';
    let teamName = '';

    // Determine role based on email or password hints (more explicit)
    console.log('Checking role detection - email:', email.toLowerCase(), 'password:', password.toLowerCase());
    
    if (email.toLowerCase().includes('coach') || password.toLowerCase().includes('coach')) {
      role = 'coach';
      fullName = 'Test Coach';
      teamName = 'Test Team';
      console.log('✅ DETECTED COACH ROLE from credentials');
    } else if (email.toLowerCase().includes('player') || password.toLowerCase().includes('player')) {
      role = 'player';
      fullName = 'Test Player';
      teamName = 'Test Team';
      console.log('✅ DETECTED PLAYER ROLE from credentials');
    } else {
      console.log('❌ NO ROLE HINTS FOUND, defaulting to player');
    }

    console.log('Final role assignment:', role);

    const mockUser: MockUser = {
      id: `mock-${Date.now()}`,
      email,
      user_metadata: {
        full_name: fullName,
        role,
        team_name: teamName,
      },
    };

    const mockSession: MockSession = {
      user: mockUser,
      access_token: `mock-token-${Date.now()}`,
    };

    console.log('Created mock session:', mockSession);

    // Store session
    localStorage.setItem('mockAuthSession', JSON.stringify(mockSession));
    
    // Update state
    setUser(mockUser);
    setSession(mockSession);
    const mockProfile = createMockProfile(mockUser);
    setProfile(mockProfile);

    console.log('Sign in complete, user role:', role);
    console.log('Final profile state:', mockProfile);

    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('mockAuthSession');
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
