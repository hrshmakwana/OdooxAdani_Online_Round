import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Users, Crown, Wrench, User, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'moderator' | 'user';
}

const roleConfig = {
  admin: { label: 'Manager', icon: Crown, color: 'bg-primary/10 text-primary' },
  moderator: { label: 'Technician', icon: Wrench, color: 'bg-warning/10 text-warning' },
  user: { label: 'Employee', icon: User, color: 'bg-muted text-muted-foreground' },
};

const AdminPanel = () => {
  const { isManager } = useRole();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all user roles with profile data
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role');

      if (rolesError) throw rolesError;

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, email');

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedUsers: UserWithRole[] = (rolesData || []).map(role => {
        const profile = profilesData?.find(p => p.user_id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          email: profile?.email || 'Unknown',
          display_name: profile?.display_name || 'Unknown User',
          role: role.role as 'admin' | 'moderator' | 'user',
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingChanges(prev => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleChange = async (userRoleId: string, userId: string) => {
    const newRole = pendingChanges[userId];
    if (!newRole) return;

    setSaving(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole as 'admin' | 'moderator' | 'user' })
        .eq('id', userRoleId);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.user_id === userId ? { ...u, role: newRole as 'admin' | 'moderator' | 'user' } : u
      ));
      setPendingChanges(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      toast.success('Role updated successfully');
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    } finally {
      setSaving(null);
    }
  };

  // Only managers can access this page
  if (!isManager) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchUsers} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Role Legend */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Role Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-medium">Manager (Admin)</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full system access</li>
                  <li>• Manage users and roles</li>
                  <li>• Create/edit equipment</li>
                  <li>• Assign technicians</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-5 h-5 text-warning" />
                  <span className="font-medium">Technician (Moderator)</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View assigned tasks</li>
                  <li>• Accept unassigned tasks</li>
                  <li>• Update task status</li>
                  <li>• Read-only equipment view</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Employee (User)</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Submit maintenance requests</li>
                  <li>• View own requests</li>
                  <li>• Limited dashboard access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Management</CardTitle>
            <CardDescription>
              {users.length} user(s) registered in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Change To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const roleInfo = roleConfig[u.role];
                    const RoleIcon = roleInfo.icon;
                    const hasPendingChange = pendingChanges[u.user_id] && pendingChanges[u.user_id] !== u.role;
                    const isCurrentUser = u.user_id === user?.id;

                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {u.display_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span>
                              {u.display_name}
                              {isCurrentUser && (
                                <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={roleInfo.color}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={pendingChanges[u.user_id] || u.role}
                            onValueChange={(value) => handleRoleChange(u.user_id, value)}
                            disabled={isCurrentUser}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border border-border shadow-lg z-50">
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Crown className="w-3 h-3" />
                                  Manager
                                </div>
                              </SelectItem>
                              <SelectItem value="moderator">
                                <div className="flex items-center gap-2">
                                  <Wrench className="w-3 h-3" />
                                  Technician
                                </div>
                              </SelectItem>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  Employee
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {hasPendingChange && (
                            <Button
                              size="sm"
                              onClick={() => saveRoleChange(u.id, u.user_id)}
                              disabled={saving === u.user_id}
                              className="gap-1"
                            >
                              {saving === u.user_id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                              Save
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
