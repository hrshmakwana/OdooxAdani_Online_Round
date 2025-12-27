import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import { useRole } from '@/contexts/RoleContext';
import { RequestFormModal } from '@/components/forms/RequestFormModal';
import { useEquipment } from '@/contexts/EquipmentContext';
import { useTeams } from '@/contexts/TeamsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

const priorityConfig = {
  low: { color: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 },
  medium: { color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  high: { color: 'bg-danger/10 text-danger border-danger/20', icon: AlertTriangle },
};

const statusConfig = {
  new: { label: 'New', color: 'bg-muted text-muted-foreground' },
  'in-progress': { label: 'In Progress', color: 'bg-warning/10 text-warning' },
  repaired: { label: 'Repaired', color: 'bg-success/10 text-success' },
  scrap: { label: 'Scrapped', color: 'bg-danger/10 text-danger' },
};

const MyRequests = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { requests, addRequest } = useMaintenanceRequests();
  const { equipment } = useEquipment();
  const { technicians } = useTeams();
  const { currentUser } = useRole();

  // Filter to only show requests created by "current user" (simulated)
  // In a real app, this would filter by auth.uid()
  const myRequests = requests;

  const handleFormSubmit = async (data: any) => {
    const selectedEquipment = equipment.find(e => e.id === data.equipmentId);
    const selectedTechnician = technicians.find(t => t.id === data.assignedToId);
    
    await addRequest({
      subject: data.subject,
      equipmentId: data.equipmentId,
      equipmentName: selectedEquipment?.name || 'Unknown Equipment',
      priority: data.priority,
      status: 'new',
      description: data.description,
      scheduledDate: data.scheduledDate,
      assignedTo: selectedTechnician ? {
        id: selectedTechnician.id,
        name: selectedTechnician.name,
        avatar: selectedTechnician.avatar,
        specialization: selectedTechnician.specialization,
      } : undefined,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">My Requests</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {currentUser.name}. You have {myRequests.length} request(s).
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Request</span>
        </Button>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {myRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No requests yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                You haven't submitted any maintenance requests.
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          myRequests.map((request, index) => {
            const priority = priorityConfig[request.priority as keyof typeof priorityConfig] || priorityConfig.low;
            const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.new;
            const PriorityIcon = priority.icon;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {request.subject}
                          </h3>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.equipmentName}
                        </p>
                        {request.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {request.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className={priority.color}>
                          <PriorityIcon className="w-3 h-3 mr-1" />
                          {request.priority}
                        </Badge>
                        {request.scheduledDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(request.scheduledDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <RequestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default MyRequests;
