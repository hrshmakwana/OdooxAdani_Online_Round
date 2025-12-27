import { useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  companyName: string;
  supportEmail: string;
  timezone: string;
  maintenanceMode: boolean;
  compactView: boolean;
  autoAssignTeams: boolean;
  preventiveScheduling: boolean;
  failureCategories: string[];
  criticalResponseTime: string;
  standardResponseTime: string;
  notifications: {
    newTicket: { email: boolean; push: boolean; slack: boolean };
    ticketResolved: { email: boolean; push: boolean; slack: boolean };
    overdueAlert: { email: boolean; push: boolean; slack: boolean };
  };
}

const defaultSettings: AppSettings = {
  companyName: 'GearGuard Industries',
  supportEmail: 'support@gearguard.io',
  timezone: 'America/New_York',
  maintenanceMode: false,
  compactView: false,
  autoAssignTeams: true,
  preventiveScheduling: true,
  failureCategories: ['Electrical', 'Mechanical', 'Hydraulic', 'Pneumatic', 'Software', 'Calibration'],
  criticalResponseTime: '2 Hours',
  standardResponseTime: '24 Hours',
  notifications: {
    newTicket: { email: true, push: true, slack: true },
    ticketResolved: { email: true, push: false, slack: true },
    overdueAlert: { email: true, push: true, slack: true },
  },
};

const SETTINGS_KEY = 'gearguard-settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return defaultSettings;
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNotification = useCallback((
    event: 'newTicket' | 'ticketResolved' | 'overdueAlert',
    channel: 'email' | 'push' | 'slack',
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [event]: {
          ...prev.notifications[event],
          [channel]: value,
        },
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    updateNotification,
    resetSettings,
  };
}
