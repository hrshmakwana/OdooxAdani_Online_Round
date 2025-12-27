import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { RequestFormModal } from '@/components/forms/RequestFormModal';
import { useEquipment } from '@/contexts/EquipmentContext';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import { useTeams } from '@/contexts/TeamsContext';
import { useSearch } from '@/contexts/SearchContext';
import { useRole } from '@/contexts/RoleContext';
import { 
  Boxes, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { equipment } = useEquipment();
  const { requests, addRequest, updateStatus } = useMaintenanceRequests();
  const { technicians } = useTeams();
  const { searchQuery } = useSearch();
  const { isEmployee, isTechnician, currentUser, isManager } = useRole();

  // Get equipment filter from URL
  const equipmentFilter = searchParams.get('equipment');
  const filteredEquipment = equipment.find(e => e.id === equipmentFilter);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const stats = useMemo(() => ({
    totalEquipment: equipment.length,
    // Exclude scrapped equipment from operational count
    operationalEquipment: equipment.filter(e => e.status === 'operational').length,
    pendingRequests: requests.filter(r => r.status === 'new').length,
    inProgressRequests: requests.filter(r => r.status === 'in-progress').length,
    averageResolutionTime: '2.4 days',
  }), [equipment, requests]);

  const filteredRequests = useMemo(() => {
    let filtered = requests;
    
    // For technicians, filter to show only assigned or unassigned requests
    if (isTechnician) {
      filtered = filtered.filter(req => 
        !req.assignedTo || req.assignedTo.name === currentUser.name
      );
    }
    
    // Apply equipment filter from URL
    if (equipmentFilter) {
      filtered = filtered.filter(req => req.equipmentId === equipmentFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(req =>
        req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.assignedTo?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [requests, searchQuery, equipmentFilter, isTechnician, currentUser.name]);

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
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    await updateStatus(requestId, newStatus as any);
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  // Redirect employees to My Requests page - MUST BE AFTER ALL HOOKS
  if (isEmployee) {
    return <Navigate to="/my-requests" replace />;
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 bg-background">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {isTechnician ? 'My Assigned Tasks' : 'Maintenance Overview'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isTechnician 
              ? `Showing tasks assigned to you or unassigned` 
              : `Avg. resolution: ${stats.averageResolutionTime}`}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Request</span>
        </Button>
      </div>

      {/* Equipment Filter Badge */}
      {equipmentFilter && filteredEquipment && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <Badge variant="secondary" className="gap-1 pr-1">
            {filteredEquipment.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={clearFilter}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </motion.div>
      )}

      {/* Stats Grid - Only for Managers */}
      {isManager && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatsCard
            title="Total Equipment"
            value={stats.totalEquipment}
            subtitle="All registered"
            icon={Boxes}
            variant="default"
            delay={0}
          />
          <StatsCard
            title="Operational"
            value={stats.operationalEquipment}
            subtitle="Running smoothly"
            icon={CheckCircle2}
            variant="success"
            delay={0.1}
          />
          <StatsCard
            title="Pending"
            value={stats.pendingRequests}
            subtitle="Awaiting action"
            icon={AlertTriangle}
            variant="warning"
            delay={0.2}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgressRequests}
            subtitle="Being worked on"
            icon={Clock}
            variant="default"
            delay={0.3}
          />
        </div>
      )}

      {/* Kanban Board */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-foreground">
          {isTechnician ? 'My Tasks' : 'Maintenance Pipeline'}
          {equipmentFilter && (
            <span className="text-muted-foreground font-normal"> - {filteredEquipment?.name}</span>
          )}
        </h3>
        <KanbanBoard 
          requests={filteredRequests}
          onCardClick={(request) => {}}
          onStatusChange={handleStatusChange}
        />
      </div>

      <RequestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Dashboard;
