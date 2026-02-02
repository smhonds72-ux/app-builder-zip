import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
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

  const [connections, setConnections] = useState({
    riotApi: true,
    valorantApi: false,
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

  const handleConnectValorant = () => {
    toast({
      title: "Connecting VALORANT API",
      description: "Please authenticate with your Riot account...",
    });
    setTimeout(() => {
      setConnections(prev => ({ ...prev, valorantApi: true }));
      toast({
        title: "Connected!",
        description: "VALORANT API has been connected successfully.",
      });
    }, 2000);
  };

  const handleDisconnectRiot = () => {
    toast({
      title: "Are you sure?",
      description: "This will disconnect the Riot Games API integration.",
      variant: "destructive",
    });
  };

  const handleSyncNow = () => {
    toast({
      title: "Syncing Data",
      description: "Fetching latest data from Riot Games API...",
    });
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "All data has been synced successfully.",
      });
    }, 2000);
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
                <p className="font-medium text-foreground">Riot Games API</p>
                <p className="text-sm text-muted-foreground">Connected - Last sync 5 mins ago</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-success" />
                <span className="text-xs text-status-success font-mono">CONNECTED</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-primary"
                  onClick={handleSyncNow}
                >
                  Sync Now
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium text-foreground">VALORANT API</p>
                <p className="text-sm text-muted-foreground">
                  {connections.valorantApi ? 'Connected' : 'Not configured'}
                </p>
              </div>
              {connections.valorantApi ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-status-success" />
                  <span className="text-xs text-status-success font-mono">CONNECTED</span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/30 hover:bg-primary/10"
                  onClick={handleConnectValorant}
                >
                  Connect
                </Button>
              )}
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
