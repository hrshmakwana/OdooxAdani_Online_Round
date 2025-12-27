import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Mail, Shield, Circle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'technician' | 'viewer';
  status: 'active' | 'offline';
}

const mockUsers: User[] = [
  { id: 'u1', name: 'Marcus Chen', email: 'marcus@gearguard.io', avatar: 'MC', role: 'admin', status: 'active' },
  { id: 'u2', name: 'Sarah Rodriguez', email: 'sarah@gearguard.io', avatar: 'SR', role: 'technician', status: 'active' },
  { id: 'u3', name: 'James Wilson', email: 'james@gearguard.io', avatar: 'JW', role: 'technician', status: 'offline' },
  { id: 'u4', name: 'Emily Park', email: 'emily@gearguard.io', avatar: 'EP', role: 'technician', status: 'active' },
  { id: 'u5', name: 'David Thompson', email: 'david@gearguard.io', avatar: 'DT', role: 'viewer', status: 'offline' },
];

const roleColors = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  technician: 'bg-primary/10 text-primary border-primary/20',
  viewer: 'bg-muted text-muted-foreground border-border',
};

export function TeamManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInvite = () => {
    if (inviteEmail && inviteRole) {
      console.log('Inviting:', inviteEmail, 'as', inviteRole);
      setInviteEmail('');
      setInviteRole('');
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 w-fit">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">Active Users</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage team members and their access levels</CardDescription>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 w-full sm:w-auto">
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 sm:mx-0 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your GearGuard workspace
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Role
                    </Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="invite-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin - Full system access</SelectItem>
                        <SelectItem value="technician">Technician - Manage tickets & equipment</SelectItem>
                        <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                  <Button onClick={handleInvite} disabled={!inviteEmail || !inviteRole} className="w-full sm:w-auto">
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {users.map((user) => (
              <div key={user.id} className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Circle 
                      className={`h-2 w-2 fill-current ${
                        user.status === 'active' ? 'text-success' : 'text-muted-foreground'
                      }`} 
                    />
                    <span className={`text-xs capitalize ${
                      user.status === 'active' ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`capitalize text-xs ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </Badge>
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
                    <th className="text-left p-4 font-semibold text-sm">User</th>
                    <th className="text-left p-4 font-semibold text-sm hidden md:table-cell">Email</th>
                    <th className="text-left p-4 font-semibold text-sm">Role</th>
                    <th className="text-left p-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className={`${idx !== users.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/20`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-sm">{user.name}</span>
                            <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">{user.email}</td>
                      <td className="p-4">
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-xs ${roleColors[user.role]}`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Circle 
                            className={`h-2 w-2 fill-current ${
                              user.status === 'active' ? 'text-success' : 'text-muted-foreground'
                            }`} 
                          />
                          <span className={`text-xs sm:text-sm capitalize ${
                            user.status === 'active' ? 'text-success' : 'text-muted-foreground'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
