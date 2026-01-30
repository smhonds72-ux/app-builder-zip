import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function Settings() {
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
                <Input defaultValue="Coach Demo" className="bg-secondary/50 border-primary/20" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input defaultValue="coach@cloud9.gg" className="bg-secondary/50 border-primary/20" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Role</label>
              <Input defaultValue="Head Coach - League of Legends" className="bg-secondary/50 border-primary/20" />
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
            {[
              { label: 'Match Alerts', description: 'Get notified before upcoming matches', enabled: true },
              { label: 'Player Status Changes', description: 'When players come online or start games', enabled: true },
              { label: 'VOD Ready Notifications', description: 'When new VODs are available for review', enabled: false },
              { label: 'Strategy Updates', description: 'When team strategies are modified', enabled: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={item.enabled} />
              </div>
            ))}
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
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium text-foreground">VALORANT API</p>
                <p className="text-sm text-muted-foreground">Not configured</p>
              </div>
              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                Connect
              </Button>
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
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
