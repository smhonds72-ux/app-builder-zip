import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDataMode } from '@/contexts/DataContext';

export default function Settings() {
  const { toast } = useToast();
  const { isLiveMode, toggleLiveMode } = useDataMode();
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [profile, setProfile] = useState({
    displayName: 'Coach Demo',
    email: 'coach@cloud9.gg',
    role: 'Head Coach - League of Legends',
  });

  const [notifications, setNotifications] = useState({
    matchAlerts: true,
    playerStatus: true,
    vodReady: false,
    strategyUpdates: true,
  });

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleDataToggle = async (enabled: boolean) => {
    setIsSyncing(true);
    const success = await toggleLiveMode(enabled);

    if (enabled && !success) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to live grid data. Please check your Supabase credentials and database schema in the console.",
        variant: "destructive",
      });
    } else if (enabled && success) {
      toast({
        title: "Live Mode Enabled",
        description: "Successfully connected to actual grid data.",
      });
    } else {
      toast({
        title: "Mock Mode Enabled",
        description: "Now using current local data.",
      });
    }
    setIsSyncing(false);
  };

  return (
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
            SETTINGS
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your dashboard preferences
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your account information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Display Name</label>
                  <Input
                      value={profile.displayName}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                  <Input
                      value={profile.email}
                      className="bg-secondary/50 border-primary/20"
                      disabled
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Role</label>
                <Input
                    value={profile.role}
                    onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    className="bg-secondary/50 border-primary/20"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure alert preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Match Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified before upcoming matches</p>
                </div>
                <Switch
                    checked={notifications.matchAlerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, matchAlerts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Player Status Changes</p>
                  <p className="text-sm text-muted-foreground">When players come online or start games</p>
                </div>
                <Switch
                    checked={notifications.playerStatus}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, playerStatus: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">VOD Ready Notifications</p>
                  <p className="text-sm text-muted-foreground">When new VODs are available for review</p>
                </div>
                <Switch
                    checked={notifications.vodReady}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, vodReady: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Strategy Updates</p>
                  <p className="text-sm text-muted-foreground">When team strategies are modified</p>
                </div>
                <Switch
                    checked={notifications.strategyUpdates}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, strategyUpdates: checked }))}
                />
              </div>
            </div>
          </motion.div>

          {/* Data Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Data & Sync</h3>
                <p className="text-sm text-muted-foreground">Manage data connections</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">Live Grid Data</p>
                  <p className="text-sm text-muted-foreground">
                    {isLiveMode ? 'Connected to Supabase' : 'Using mock data'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isSyncing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  <Switch
                      checked={isLiveMode}
                      disabled={isSyncing}
                      onCheckedChange={handleDataToggle}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
        >
          <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
            ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
            )}
          </Button>
        </motion.div>
      </div>
  );
}
