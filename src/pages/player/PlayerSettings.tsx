import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PlayerSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground tracking-wide">
          SETTINGS
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your player terminal experience
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-blue/20">
            <User className="w-5 h-5 text-brand-blue" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Profile</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input 
              id="displayName" 
              defaultValue="Jax" 
              className="bg-secondary/50 border-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ign">In-Game Name</Label>
            <Input 
              id="ign" 
              defaultValue="C9 Jax" 
              className="bg-secondary/50 border-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="top">
              <SelectTrigger className="bg-secondary/50 border-brand-blue/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top Lane</SelectItem>
                <SelectItem value="jungle">Jungle</SelectItem>
                <SelectItem value="mid">Mid Lane</SelectItem>
                <SelectItem value="adc">ADC</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input 
              id="team" 
              defaultValue="Cloud9" 
              disabled
              className="bg-secondary/30 border-brand-blue/10"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-blue/20">
            <Bell className="w-5 h-5 text-brand-blue" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New Drill Assignments</Label>
              <p className="text-sm text-muted-foreground">Get notified when coach assigns new drills</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>VOD Session Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminder 30 minutes before scheduled sessions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Performance Insights</Label>
              <p className="text-sm text-muted-foreground">Weekly performance summary notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Leak Alerts</Label>
              <p className="text-sm text-muted-foreground">Get alerted when new leaks are detected</p>
            </div>
            <Switch />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/50 backdrop-blur-xl border border-brand-blue/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-brand-blue/20">
            <Palette className="w-5 h-5 text-brand-blue" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select defaultValue="dark">
              <SelectTrigger className="bg-secondary/50 border-brand-blue/20 w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark (Default)</SelectItem>
                <SelectItem value="light" disabled>Light (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and effects</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Performance Radar</Label>
              <p className="text-sm text-muted-foreground">Display radar chart on dashboard</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button className="bg-brand-blue hover:bg-brand-blue/80">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
