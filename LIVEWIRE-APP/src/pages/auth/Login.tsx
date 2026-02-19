import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualLogin, setIsManualLogin] = useState(false);
  const { signIn, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  // Redirect only after successful login (not on page load)
  useEffect(() => {
    if (!loading && user && profile && isManualLogin) {
      console.log('Login successful, redirecting to:', profile.role === 'coach' ? '/coach' : '/player');
      const destination = redirectPath || (profile.role === 'coach' ? '/coach' : '/player');
      navigate(destination);
    }
  }, [user, profile, loading, navigate, redirectPath, isManualLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsManualLogin(true);

    try {
      const { error: authError } = await signIn(email, password);

      if (authError) {
        setError(authError);
        setIsLoading(false);
        setIsManualLogin(false);
        return;
      }

      // Navigation will happen via the useEffect when profile is loaded
      console.log('Sign in completed, waiting for redirect...');
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
      setIsManualLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(/war-room-bg.png)',
            filter: 'blur(4px)'
          }}
        />
        <div className="absolute inset-0 grid-pattern opacity-20 z-20" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 w-full max-w-md px-6"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
          
          {/* Card */}
          <div className="relative bg-gradient-to-br from-card/80 to-secondary/60 backdrop-blur-2xl border border-primary/30 rounded-2xl p-8">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-2xl" />

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-lg rounded-lg" />
                  <div className="relative bg-gradient-to-br from-primary to-brand-blue p-3 rounded-lg">
                    <Zap className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="text-2xl font-display font-bold">
                  <span className="text-foreground">LIVE</span>
                  <span className="holo-text">WIRE</span>
                </span>
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-display font-bold text-center text-foreground mb-2">
              WELCOME BACK
            </h1>
            <p className="text-muted-foreground text-center mb-8 font-body">
              Sign in to access your portal
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@livewire.gg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-primary/20 focus:border-primary/50 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-secondary/50 border-primary/20 focus:border-primary/50 h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 font-display font-bold text-lg bg-gradient-to-r from-primary to-brand-blue hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'SIGN IN'
                )}
              </Button>
            </form>

            {/* Quick Access for Testing */}
            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="text-center text-muted-foreground text-sm mb-4 font-body">
                Quick Access (Testing)
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Button
                  onClick={async () => {
                    setEmail('coach@test.com');
                    setPassword('coach123');
                    setIsManualLogin(true);
                    
                    // Wait a moment for state to update
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Manually trigger sign in
                    const result = await signIn('coach@test.com', 'coach123');
                    console.log('Manual sign in result:', result);
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-secondary/50 border-primary/30 hover:bg-primary/20 hover:border-primary/50 h-10 text-xs"
                >
                  Coach Portal
                </Button>
                <Button
                  onClick={async () => {
                    setEmail('player@test.com');
                    setPassword('player123');
                    setIsManualLogin(true);
                    
                    // Wait a moment for state to update
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Manually trigger sign in
                    const result = await signIn('player@test.com', 'player123');
                    console.log('Manual sign in result:', result);
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-secondary/50 border-primary/30 hover:bg-primary/20 hover:border-primary/50 h-10 text-xs"
                >
                  Player Portal
                </Button>
              </div>
            </div>

            {/* Register Link */}
            <p className="mt-6 text-center text-muted-foreground font-body">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <polygon
            points="40,8 72,24 72,56 40,72 8,56 8,24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />
        </svg>
      </div>
    </div>
  );
};

export default Login;
