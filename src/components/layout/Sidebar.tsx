import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Calendar, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole, AppRole } from '@/contexts/RoleContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  requiredPermission?: 'canViewDashboard' | 'canViewEquipment' | 'canViewTeams' | 'canViewSchedule' | 'canViewSettings' | 'canViewAdmin';
}

const allNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', requiredPermission: 'canViewDashboard' },
  { icon: Wrench, label: 'Equipment', href: '/equipment', requiredPermission: 'canViewEquipment' },
  { icon: Users, label: 'Teams', href: '/teams', requiredPermission: 'canViewTeams' },
  { icon: Calendar, label: 'Schedule', href: '/schedule', requiredPermission: 'canViewSchedule' },
  { icon: Settings, label: 'Settings', href: '/settings', requiredPermission: 'canViewSettings' },
  { icon: Shield, label: 'Admin Panel', href: '/admin', requiredPermission: 'canViewAdmin' },
];

const employeeNavItems: NavItem[] = [
  { icon: FileText, label: 'My Requests', href: '/my-requests' },
  { icon: Plus, label: 'New Request', href: '/new-request' },
];

const roleOptions: { value: AppRole; label: string }[] = [
  { value: 'manager', label: 'Manager' },
  { value: 'technician', label: 'Technician' },
  { value: 'employee', label: 'Employee' },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onCollapsedChange, onNavigate }: SidebarProps) {
  const location = useLocation();
  const { role, setRole, currentUser, roleLabel, isEmployee, isSimulationMode, canViewDashboard, canViewEquipment, canViewTeams, canViewSchedule, canViewSettings, canViewAdmin } = useRole();

  const permissions: Record<string, boolean> = {
    canViewDashboard,
    canViewEquipment,
    canViewTeams,
    canViewSchedule,
    canViewSettings,
    canViewAdmin,
  };

  // Filter nav items based on role
  const navItems = isEmployee 
    ? employeeNavItems 
    : allNavItems.filter(item => 
        !item.requiredPermission || permissions[item.requiredPermission]
      );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="sidebar-gradient min-h-screen h-full flex flex-col border-r border-sidebar-border relative z-20 sticky top-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">GearGuard</h1>
              <p className="text-xs text-sidebar-muted">Enterprise Maintenance</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <NavLink
              key={item.label}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full"
                >
                  {item.badge}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="p-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-sidebar-primary-foreground">
                  {currentUser.avatar}
                </span>
              </div>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium truncate">
                      {currentUser.name} ({roleLabel})
                    </p>
                    <p className="text-xs text-sidebar-muted">
                      {isSimulationMode ? 'Simulation Mode' : 'View as:'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && <ChevronDown className="w-4 h-4 text-sidebar-muted" />}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg z-50">
            <DropdownMenuLabel>Switch View</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roleOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setRole(option.value)}
                className={cn(
                  'cursor-pointer',
                  role === option.value && 'bg-accent'
                )}
              >
                {option.label}
                {role === option.value && (
                  <span className="ml-auto text-xs text-muted-foreground">Current</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle - Desktop Only */}
      <div className="p-3 border-t border-sidebar-border hidden lg:block">
        <motion.button
          onClick={() => onCollapsedChange(!collapsed)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
