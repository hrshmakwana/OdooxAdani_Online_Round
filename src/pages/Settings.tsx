import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { MaintenanceConfiguration } from '@/components/settings/MaintenanceConfiguration';
import { TeamManagement } from '@/components/settings/TeamManagement';
import { NotificationsIntegrations } from '@/components/settings/NotificationsIntegrations';
import { Settings as SettingsIcon, Wrench, Users, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppSettings } from '@/contexts/SettingsContext';
import { useEffect, useState } from 'react';

const Settings = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { settings, updateSetting, updateNotification } = useAppSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const handleGeneralChange = (key: string, value: string | boolean) => {
    updateSetting(key as keyof typeof settings, value as never);
  };

  const handleMaintenanceChange = (key: string, value: string | boolean | string[]) => {
    updateSetting(key as keyof typeof settings, value as never);
  };

  const handleNotificationChange = (event: string, channel: string, value: boolean) => {
    updateNotification(
      event as 'newTicket' | 'ticketResolved' | 'overdueAlert',
      channel as 'email' | 'push' | 'slack',
      value
    );
  };

  const handleDarkModeChange = (enabled: boolean) => {
    setTheme(enabled ? 'dark' : 'light');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'team', label: 'Team & Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 bg-background overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <Tabs defaultValue="general" className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Tab Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="glass-card rounded-xl p-2 lg:sticky lg:top-4">
              <TabsList className="flex w-full h-auto bg-transparent gap-1 overflow-x-auto lg:flex-col scrollbar-hide">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-shrink-0 min-w-max lg:w-full justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:hover:bg-muted/50 rounded-lg transition-all whitespace-nowrap"
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <TabsContent value="general" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <GeneralSettings 
                settings={{ 
                  companyName: settings.companyName,
                  supportEmail: settings.supportEmail,
                  timezone: settings.timezone,
                  maintenanceMode: settings.maintenanceMode,
                  darkMode: mounted ? isDark : false,
                  compactView: settings.compactView,
                }} 
                onSettingsChange={handleGeneralChange}
                onDarkModeChange={handleDarkModeChange}
              />
            </TabsContent>
            
            <TabsContent value="maintenance" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <MaintenanceConfiguration 
                config={{
                  autoAssignTeams: settings.autoAssignTeams,
                  preventiveScheduling: settings.preventiveScheduling,
                  failureCategories: settings.failureCategories,
                  criticalResponseTime: settings.criticalResponseTime,
                  standardResponseTime: settings.standardResponseTime,
                }} 
                onConfigChange={handleMaintenanceChange} 
              />
            </TabsContent>
            
            <TabsContent value="team" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <TeamManagement />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <NotificationsIntegrations 
                notifications={settings.notifications} 
                onNotificationChange={handleNotificationChange} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
