import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export type AppRole = 'manager' | 'technician' | 'employee';

interface RoleContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  currentUser: { name: string; avatar: string; email: string };
  roleLabel: string;
  canEdit: boolean;
  canViewTeams: boolean;
  canViewSettings: boolean;
  canViewDashboard: boolean;
  canViewEquipment: boolean;
  canViewSchedule: boolean;
  canViewAdmin: boolean;
  canAssignTechnicians: boolean;
  canAcceptTasks: boolean;
  canUpdateTaskStatus: boolean;
  isManager: boolean;
  isTechnician: boolean;
  isEmployee: boolean;
  isSimulationMode: boolean;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AppRole>('manager');
  const [loading, setLoading] = useState(false);

  const setRole = useCallback((newRole: AppRole) => {
    setRoleState(newRole);
    toast.success(`Switched to ${newRole} View`);
  }, []);

  const permissions = {
    canViewDashboard: role !== 'employee',
    canViewEquipment: role !== 'employee',
    canViewTeams: role === 'manager',
    canViewSchedule: role !== 'employee',
    canViewSettings: role === 'manager',
    canViewAdmin: role === 'manager',
    canEdit: role === 'manager',
    canAssignTechnicians: role === 'manager',
    canAcceptTasks: role !== 'employee',
    canUpdateTaskStatus: role !== 'employee',
    isManager: role === 'manager',
    isTechnician: role === 'technician',
    isEmployee: role === 'employee',
  };

  const currentUser = {
    name: 'Marcus',
    avatar: 'M',
    email: 'admin@gearguard.io'
  };

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      currentUser, 
      roleLabel: role.charAt(0).toUpperCase() + role.slice(1),
      isSimulationMode: true,
      loading,
      ...permissions 
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
}