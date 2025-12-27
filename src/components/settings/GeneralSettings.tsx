import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Globe, Moon, Maximize2, Wrench } from 'lucide-react';

interface GeneralSettingsProps {
  settings: {
    companyName: string;
    supportEmail: string;
    timezone: string;
    maintenanceMode: boolean;
    darkMode: boolean;
    compactView: boolean;
  };
  onSettingsChange: (key: string, value: string | boolean) => void;
  onDarkModeChange: (enabled: boolean) => void;
}

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'EST (Eastern Standard Time)' },
  { value: 'America/Chicago', label: 'CST (Central Standard Time)' },
  { value: 'America/Denver', label: 'MST (Mountain Standard Time)' },
  { value: 'America/Los_Angeles', label: 'PST (Pacific Standard Time)' },
  { value: 'Europe/London', label: 'GMT (Greenwich Mean Time)' },
  { value: 'Europe/Paris', label: 'CET (Central European Time)' },
  { value: 'Asia/Tokyo', label: 'JST (Japan Standard Time)' },
  { value: 'Asia/Shanghai', label: 'CST (China Standard Time)' },
  { value: 'Australia/Sydney', label: 'AEST (Australian Eastern Time)' },
];

export function GeneralSettings({ settings, onSettingsChange, onDarkModeChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Organization Profile */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 w-fit">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Organization Profile</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your company's identity and contact information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => onSettingsChange('companyName', e.target.value)}
                placeholder="Enter company name"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail" className="text-sm">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => onSettingsChange('supportEmail', e.target.value)}
                placeholder="support@company.com"
                className="h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Timezone
            </Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => onSettingsChange('timezone', value)}
            >
              <SelectTrigger id="timezone" className="h-10">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Critical for scheduling maintenance tasks</p>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 w-fit">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">System Preferences</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure global system behavior and appearance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
          {/* Maintenance Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="space-y-0.5 min-w-0 flex-1">
              <Label className="text-sm sm:text-base font-medium">Maintenance Mode</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Temporarily disable new ticket creation for system updates
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => onSettingsChange('maintenanceMode', checked)}
              className="flex-shrink-0"
            />
          </div>
          
          {/* Dark Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <Moon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="space-y-0.5 min-w-0">
                <Label className="text-sm sm:text-base font-medium">Dark Mode</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Switch to dark theme for reduced eye strain
                </p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={onDarkModeChange}
              className="flex-shrink-0"
            />
          </div>
          
          {/* Compact View */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <Maximize2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="space-y-0.5 min-w-0">
                <Label className="text-sm sm:text-base font-medium">Compact View (High Density)</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Display more information with reduced spacing
                </p>
              </div>
            </div>
            <Switch
              checked={settings.compactView}
              onCheckedChange={(checked) => onSettingsChange('compactView', checked)}
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
