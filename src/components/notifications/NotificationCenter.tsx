import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, UserPlus, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'overdue' | 'assignment' | 'reminder';
  title: string;
  description: string;
  time: string;
  link: string;
  equipmentId?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'overdue',
    title: 'Overdue: Hydraulic Press Repair',
    description: 'Oil leak repair is 2 days overdue',
    time: '2 hours ago',
    link: '/equipment/eq2',
    equipmentId: 'eq2',
  },
  {
    id: 'n2',
    type: 'assignment',
    title: 'New Assignment',
    description: 'Laser Cutter calibration assigned to you',
    time: '4 hours ago',
    link: '/equipment/eq7',
    equipmentId: 'eq7',
  },
  {
    id: 'n3',
    type: 'overdue',
    title: 'Overdue: Conveyor Belt Inspection',
    description: 'Belt tension adjustment is 1 day overdue',
    time: '6 hours ago',
    link: '/equipment/eq4',
    equipmentId: 'eq4',
  },
  {
    id: 'n4',
    type: 'assignment',
    title: 'New Assignment',
    description: 'Forklift maintenance scheduled for tomorrow',
    time: '1 day ago',
    link: '/schedule',
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Upcoming: CNC Lathe PM',
    description: 'Preventive maintenance due in 3 days',
    time: '1 day ago',
    link: '/schedule',
  },
];

const notificationConfig = {
  overdue: {
    icon: AlertCircle,
    borderClass: 'border-l-4 border-l-danger',
    iconClass: 'text-danger',
    bgClass: 'bg-danger/5',
  },
  assignment: {
    icon: UserPlus,
    borderClass: 'border-l-4 border-l-primary',
    iconClass: 'text-primary',
    bgClass: 'bg-primary/5',
  },
  reminder: {
    icon: Clock,
    borderClass: 'border-l-4 border-l-warning',
    iconClass: 'text-warning',
    bgClass: 'bg-warning/5',
  },
};

export function NotificationCenter() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const overdueCount = notifications.filter(n => n.type === 'overdue').length;

  const handleNotificationClick = (notification: Notification) => {
    setOpen(false);
    navigate(notification.link);
  };

  const handleDismiss = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
        >
          <Bell className="w-5 h-5 text-primary-foreground" />
          {overdueCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-danger-foreground text-xs font-bold rounded-full flex items-center justify-center"
            >
              {overdueCount}
            </motion.span>
          )}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0 bg-card border-border shadow-xl" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <span className="text-xs text-muted-foreground">
              {notifications.length} total
            </span>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => {
              const config = notificationConfig[notification.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group',
                    config.borderClass,
                    config.bgClass
                  )}
                >
                  <button
                    onClick={(e) => handleDismiss(e, notification.id)}
                    className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <div className="flex gap-3">
                    <div className={cn('mt-0.5', config.iconClass)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-foreground truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button variant="ghost" className="w-full text-sm" onClick={handleClearAll}>
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
