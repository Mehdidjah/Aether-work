import { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  Keyboard, 
  Download,
  Trash2,
  Link2,
  Eye,
  EyeOff,
  Monitor,
  Moon,
  Sun,
  Mail,
  MessageSquare,
  Smartphone,
  Volume2,
  VolumeX,
  Clock,
  Languages,
  Lock,
  UserX,
  Database,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/workspace-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  mentionAlerts: boolean;
  taskReminders: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  soundEnabled: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  showOnlineStatus: boolean;
  showActivity: boolean;
  allowDataCollection: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
}

export default function SettingsPage() {
  const { theme, setTheme } = useWorkspaceStore();
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    mentionAlerts: true,
    taskReminders: true,
    weeklyDigest: false,
    marketingEmails: false,
    soundEnabled: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'team',
    showOnlineStatus: true,
    showActivity: true,
    allowDataCollection: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification settings updated');
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success('Privacy settings updated');
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean | string) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
    toast.success('Security settings updated');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const connectedAccounts = [
    { name: 'Google', connected: true, email: 'alex@gmail.com' },
    { name: 'GitHub', connected: true, username: 'alexchen' },
    { name: 'Slack', connected: false },
    { name: 'Microsoft', connected: false },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Appearance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="flex gap-3">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={theme === option.value ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <Languages className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger id="timeFormat">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'pushNotifications', icon: Smartphone, label: 'Push Notifications', description: 'Get notified on your device' },
              { key: 'inAppNotifications', icon: MessageSquare, label: 'In-App Notifications', description: 'Show notifications in the app' },
              { key: 'mentionAlerts', icon: Bell, label: 'Mention Alerts', description: 'Get notified when someone mentions you' },
              { key: 'taskReminders', icon: Clock, label: 'Task Reminders', description: 'Receive reminders for upcoming tasks' },
              { key: 'weeklyDigest', icon: Mail, label: 'Weekly Digest', description: 'Get a summary of your week' },
              { key: 'soundEnabled', icon: notifications.soundEnabled ? Volume2 : VolumeX, label: 'Sound Effects', description: 'Play sounds for notifications' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications[item.key as keyof NotificationSettings]}
                  onCheckedChange={() => handleNotificationChange(item.key as keyof NotificationSettings)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control your privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select 
              value={privacy.profileVisibility} 
              onValueChange={(v) => handlePrivacyChange('profileVisibility', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                <SelectItem value="team">Team - Only team members can see your profile</SelectItem>
                <SelectItem value="private">Private - Only you can see your profile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {[
            { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you are online' },
            { key: 'showActivity', label: 'Show Activity', description: 'Display your recent activity to team members' },
            { key: 'allowDataCollection', label: 'Analytics & Improvements', description: 'Help us improve by sharing anonymous usage data' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={privacy[item.key as keyof PrivacySettings] as boolean}
                onCheckedChange={(v) => handlePrivacyChange(item.key as keyof PrivacySettings, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {security.twoFactorEnabled && <Badge variant="secondary">Enabled</Badge>}
              <Switch
                checked={security.twoFactorEnabled}
                onCheckedChange={(v) => handleSecurityChange('twoFactorEnabled', v)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Login Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified of new sign-ins</p>
              </div>
            </div>
            <Switch
              checked={security.loginAlerts}
              onCheckedChange={(v) => handleSecurityChange('loginAlerts', v)}
            />
          </div>

          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <Select 
              value={security.sessionTimeout} 
              onValueChange={(v) => handleSecurityChange('sessionTimeout', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Change Password
            </Label>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={handlePasswordChange} disabled={!currentPassword || !newPassword}>
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>Manage your connected services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedAccounts.map((account) => (
            <div key={account.name} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium",
                  account.connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {account.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  {account.connected && (
                    <p className="text-xs text-muted-foreground">
                      {account.email || `@${account.username}`}
                    </p>
                  )}
                </div>
              </div>
              <Button variant={account.connected ? 'outline' : 'secondary'} size="sm">
                {account.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Download className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Export Data</p>
                <p className="text-xs text-muted-foreground">Download all your data as a ZIP file</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <UserX className="h-4 w-4 text-error" />
              <div>
                <p className="text-sm font-medium text-error">Deactivate Account</p>
                <p className="text-xs text-muted-foreground">Temporarily disable your account</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-error hover:text-error">
                  Deactivate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your account will be temporarily disabled. You can reactivate it by logging in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast.success('Account deactivated')}>
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Trash2 className="h-4 w-4 text-error" />
              <div>
                <p className="text-sm font-medium text-error">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => toast.error('Account deletion initiated')}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription>Quick access to common actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { keys: ['⌘', 'K'], action: 'Open command palette' },
              { keys: ['⌘', 'B'], action: 'Toggle sidebar' },
              { keys: ['⌘', 'N'], action: 'New document' },
              { keys: ['⌘', 'S'], action: 'Save changes' },
              { keys: ['⌘', '/'], action: 'Show shortcuts' },
              { keys: ['⌘', '⇧', 'P'], action: 'Quick search' },
              { keys: ['⌘', 'Z'], action: 'Undo' },
              { keys: ['⌘', '⇧', 'Z'], action: 'Redo' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, j) => (
                    <kbd 
                      key={j}
                      className="px-2 py-1 text-xs font-mono bg-muted rounded border"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
