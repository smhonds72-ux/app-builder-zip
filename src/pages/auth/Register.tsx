import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle, Loader2, Shield, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signUp(email, password, fullName, role, teamName || undefined);

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 z-10" />
          <div className="absolute inset-0 grid-pattern opacity-20 z-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-30 text-center px-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-status-success/20 mb-6">
            <CheckCircle className="w-10 h-10 text-status-success" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            REGISTRATION COMPLETE
          </h1>
          <p className="text-muted-foreground font-body max-w-md">
            Please check your email to confirm your account. Redirecting to login...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-12">
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

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 w-full max-w-lg px-6"
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
              JOIN LIVEWIRE
            </h1>
            <p className="text-muted-foreground text-center mb-8 font-body">
              Create your account to get started
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

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole('coach')}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  role === 'coach'
                    ? 'border-primary bg-primary/10'
                    : 'border-primary/20 bg-secondary/30 hover:border-primary/40'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Shield className={`w-8 h-8 ${role === 'coach' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-display font-bold ${role === 'coach' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    COACH
                  </span>
                </div>
                {role === 'coach' && (
                  <motion.div
                    layoutId="roleIndicator"
                    className="absolute inset-0 border-2 border-primary rounded-xl"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole('player')}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  role === 'player'
                    ? 'border-brand-blue bg-brand-blue/10'
                    : 'border-brand-blue/20 bg-secondary/30 hover:border-brand-blue/40'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Users className={`w-8 h-8 ${role === 'player' ? 'text-brand-blue' : 'text-muted-foreground'}`} />
                  <span className={`font-display font-bold ${role === 'player' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    PLAYER
                  </span>
                </div>
                {role === 'player' && (
                  <motion.div
                    layoutId="roleIndicator"
                    className="absolute inset-0 border-2 border-brand-blue rounded-xl"
                  />
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-secondary/50 border-primary/20 focus:border-primary/50 h-12"
                />
              </div>

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
                <Label htmlFor="teamName" className="text-foreground font-medium">
                  Team Name {role === 'player' && <span className="text-muted-foreground">(Optional)</span>}
                </Label>
                <Input
                  id="teamName"
                  type="text"
                  placeholder="e.g., Cloud9, Team Liquid"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-secondary/50 border-primary/20 focus:border-primary/50 h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 font-display font-bold text-lg transition-opacity ${
                  role === 'coach'
                    ? 'bg-gradient-to-r from-primary to-brand-blue'
                    : 'bg-gradient-to-r from-brand-blue to-primary'
                } hover:opacity-90`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'CREATE ACCOUNT'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-muted-foreground font-body">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-brand-blue"
          />
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-brand-blue"
          />
        </svg>
      </div>
    </div>
  );
};

export default Register;
