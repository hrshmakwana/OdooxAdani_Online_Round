import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Link2, MessageSquare, Mail, Smartphone, CheckCircle2, XCircle, Beaker } from 'lucide-react';

interface NotificationPrefs {
  newTicket: { email: boolean; push: boolean; slack: boolean };
  ticketResolved: { email: boolean; push: boolean; slack: boolean };
  overdueAlert: { email: boolean; push: boolean; slack: boolean };
}

interface NotificationsIntegrationsProps {
  notifications: NotificationPrefs;
  onNotificationChange: (event: string, channel: string, value: boolean) => void;
}

const integrations = [
  { id: 'slack', name: 'Slack', icon: MessageSquare, status: 'connected' as const, description: 'Real-time notifications' },
  { id: 'smtp', name: 'SMTP Server', icon: Mail, status: 'disconnected' as const, description: 'Custom email server' },
  { id: 'odoo', name: 'Odoo ERP Sync', icon: Link2, status: 'beta' as const, description: 'Two-way data sync' },
];

const statusStyles = {
  connected: { badge: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 },
  disconnected: { badge: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
  beta: { badge: 'bg-warning/10 text-warning border-warning/20', icon: Beaker },
};

export function NotificationsIntegrations({ notifications, onNotificationChange }: NotificationsIntegrationsProps) {
  const events = [
    { key: 'newTicket', label: 'New Ticket Created', shortLabel: 'New Ticket' },
    { key: 'ticketResolved', label: 'Ticket Resolved', shortLabel: 'Resolved' },
    { key: 'overdueAlert', label: 'Overdue Alert', shortLabel: 'Overdue' },
  ];

  const channels = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'push', label: 'Push', icon: Smartphone },
    { key: 'slack', label: 'Slack', icon: MessageSquare },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Channel Preferences */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 w-fit">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Channel Preferences</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Choose how you want to receive notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-4">
            {events.map((event) => (
              <div key={event.key} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                <p className="font-medium text-sm mb-3">{event.label}</p>
                <div className="flex flex-wrap gap-3">
                  {channels.map((channel) => (
                    <label key={channel.key} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={notifications[event.key as keyof NotificationPrefs][channel.key as 'email' | 'push' | 'slack']}
                        onCheckedChange={(checked) => 
                          onNotificationChange(event.key, channel.key, checked as boolean)
                        }
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex items-center gap-1.5">
                        <channel.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{channel.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block rounded-lg border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">Event</th>
                    {channels.map((channel) => (
                      <th key={channel.key} className="text-center p-3 sm:p-4 font-semibold text-xs sm:text-sm">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                          <channel.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="hidden md:inline">{channel.label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, idx) => (
                    <tr 
                      key={event.key} 
                      className={`${idx !== events.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/20`}
                    >
                      <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">
                        <span className="hidden md:inline">{event.label}</span>
                        <span className="md:hidden">{event.shortLabel}</span>
                      </td>
                      {channels.map((channel) => (
                        <td key={channel.key} className="text-center p-3 sm:p-4">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={notifications[event.key as keyof NotificationPrefs][channel.key as 'email' | 'push' | 'slack']}
                              onCheckedChange={(checked) => 
                                onNotificationChange(event.key, channel.key, checked as boolean)
                              }
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Connections */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 w-fit">
              <Link2 className="h-5 w-5 text-warning" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">External Connections</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage third-party integrations and data sync</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3">
          {integrations.map((integration) => {
            const StatusIcon = statusStyles[integration.status].icon;
            return (
              <div 
                key={integration.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="p-2 rounded-lg bg-background border border-border/50 flex-shrink-0">
                    <integration.icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{integration.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs capitalize ${statusStyles[integration.status].badge}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Button 
                  variant={integration.status === 'connected' ? 'outline' : 'default'}
                  size="sm"
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  {integration.status === 'connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
