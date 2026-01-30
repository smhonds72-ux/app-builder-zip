import { motion } from 'framer-motion';
import { Shield, Users, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const initialParticles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(initialParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

const Index = () => {
  const handleCoachClick = () => {
    console.log('Coach Portal clicked - Google OAuth would trigger here');
    // In production: signIn('google', { callbackUrl: '/coach' })
  };

  const handlePlayerClick = () => {
    console.log('Player Terminal clicked - Google OAuth would trigger here');
    // In production: signIn('google', { callbackUrl: '/player' })
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background with war room imagery */}
      <div className="absolute inset-0 z-0">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 z-10" />
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(/war-room-bg.png)',
            filter: 'blur(2px)'
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20 z-20" />
        
        {/* Animated scanlines */}
        <div className="absolute inset-0 scanline-overlay z-20" />
        
        {/* Floating holographic particles */}
        <FloatingParticles />
      </div>

      {/* Main content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200 
            }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-50 rounded-2xl" />
              <div className="relative bg-gradient-to-br from-primary to-brand-blue p-6 rounded-2xl shadow-2xl">
                <Zap className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black font-display tracking-tight mb-4"
          >
            <span className="text-foreground">LIVE</span>
            <span className="holo-text">WIRE</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto"
          >
            Comprehensive AI Assistant Coach & Predictive Analytics Platform
          </motion.p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
          {/* Coach Portal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="group cursor-pointer"
            onClick={handleCoachClick}
          >
            <div className="relative h-full">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative h-full bg-gradient-to-br from-card/60 to-secondary/40 backdrop-blur-2xl border border-primary/30 rounded-2xl p-8 transition-all duration-300 group-hover:border-primary/60">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/50 rounded-br-2xl" />
                
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
                    <div className="relative bg-secondary/80 p-6 rounded-full border border-primary/40">
                      <Shield className="w-12 h-12 text-primary" strokeWidth={2} />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-3 tracking-wide">
                  COACH PORTAL
                </h2>
                
                {/* Description */}
                <p className="text-muted-foreground text-center font-body leading-relaxed">
                  Access Command Center, Team Analytics, and Strategy Tools
                </p>
                
                {/* Animated underline */}
                <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover:via-primary transition-all duration-500" />
              </div>
            </div>
          </motion.div>

          {/* Player Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="group cursor-pointer"
            onClick={handlePlayerClick}
          >
            <div className="relative h-full">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Card */}
              <div className="relative h-full bg-gradient-to-br from-card/60 to-secondary/40 backdrop-blur-2xl border border-brand-blue/30 rounded-2xl p-8 transition-all duration-300 group-hover:border-brand-blue/60">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-blue/50 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-brand-blue/50 rounded-br-2xl" />
                
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-blue/30 blur-lg rounded-full" />
                    <div className="relative bg-secondary/80 p-6 rounded-full border border-brand-blue/40">
                      <Users className="w-12 h-12 text-brand-blue" strokeWidth={2} />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-3 tracking-wide">
                  PLAYER TERMINAL
                </h2>
                
                {/* Description */}
                <p className="text-muted-foreground text-center font-body leading-relaxed">
                  View Personal Stats, Drills, and Performance Leaks
                </p>
                
                {/* Animated underline */}
                <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent group-hover:via-brand-blue transition-all duration-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm font-mono text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
            <span>SYSTEM STATUS: <span className="text-status-success">ONLINE</span></span>
          </div>
          
          <div className="w-px h-4 bg-border hidden md:block" />
          
          <div className="flex items-center gap-2">
            <span>V2.5.0-BETA</span>
          </div>
          
          <div className="w-px h-4 bg-border hidden md:block" />
          
          <div className="flex items-center gap-2">
            <span>CLOUD9 SYSTEMS</span>
          </div>
        </motion.div>

        {/* Decorative data streams */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          <div className="relative h-full overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent"
              animate={{
                x: ['100%', '-100%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating tactical elements */}
      <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon
            points="50,10 90,30 90,70 50,90 10,70 10,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />
        </svg>
      </div>

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

export default Index;
