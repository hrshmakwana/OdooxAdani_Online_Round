import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Equipment } from '@/data/mockData';
import { SmartButton } from './SmartButton';
import { cn } from '@/lib/utils';
import { useSearch } from '@/contexts/SearchContext';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import { 
  CheckCircle2, 
  Wrench, 
  AlertTriangle, 
  XCircle,
  Search,
  Plus,
  Pencil,
  Trash2,
  Ban
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const statusConfig = {
  operational: {
    label: 'Operational',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success',
  },
  maintenance: {
    label: 'Maintenance',
    icon: Wrench,
    className: 'bg-warning/10 text-warning',
  },
  repair: {
    label: 'Under Repair',
    icon: AlertTriangle,
    className: 'bg-danger/10 text-danger',
  },
  scrap: {
    label: 'Scrapped',
    icon: XCircle,
    className: 'bg-muted text-muted-foreground',
  },
};

// Health badge based on status - Scrapped = Decommissioned
const getHealthBadge = (status: Equipment['status'], activeRepairs: number) => {
  if (status === 'scrap') {
    return {
      label: 'Decommissioned',
      icon: Ban,
      className: 'bg-muted text-muted-foreground',
    };
  }
  if (activeRepairs === 0) {
    return {
      label: 'Healthy',
      icon: CheckCircle2,
      className: 'bg-success/10 text-success',
    };
  }
  return {
    label: `${activeRepairs} Active`,
    icon: Wrench,
    className: 'bg-warning/10 text-warning',
  };
};

interface EquipmentListProps {
  equipment: Equipment[];
  onEquipmentClick?: (equipment: Equipment) => void;
  onAddClick?: () => void;
  onEditClick?: (equipment: Equipment) => void;
  onDeleteClick?: (id: string) => void;
}

export function EquipmentList({ 
  equipment, 
  onEquipmentClick, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}: EquipmentListProps) {
  const navigate = useNavigate();
  const { searchQuery: globalSearch } = useSearch();
  const { requests } = useMaintenanceRequests();
  const [localSearch, setLocalSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Get maintenance count for equipment
  const getMaintenanceCount = (equipmentId: string) => {
    return requests.filter(r => r.equipmentId === equipmentId && r.status !== 'repaired' && r.status !== 'scrap').length;
  };

  // Combine global and local search
  const filteredEquipment = useMemo(() => {
    const query = globalSearch || localSearch;
    return equipment.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(query.toLowerCase()) ||
      item.department.toLowerCase().includes(query.toLowerCase())
    );
  }, [equipment, globalSearch, localSearch]);

  const handleDelete = () => {
    if (deleteId && onDeleteClick) {
      onDeleteClick(deleteId);
      setDeleteId(null);
    }
  };

  const handleSmartButtonClick = (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    // Navigate to dashboard with equipment filter
    navigate(`/?equipment=${equipmentId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Search Bar & Add Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        {onAddClick && (
          <Button onClick={onAddClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {filteredEquipment.map((item, index) => {
          const status = statusConfig[item.status];
          const StatusIcon = status.icon;
          const health = getHealthBadge(item.status, item.activeRepairs);
          const HealthIcon = health.icon;
          const maintenanceCount = getMaintenanceCount(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => onEquipmentClick?.(item)}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      {item.serialNumber}
                    </code>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {onEditClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(item);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{item.department}</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    status.className
                  )}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    health.className
                  )}>
                    <HealthIcon className="w-3 h-3" />
                    {health.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Last maintained: {new Date(item.lastMaintenance).toLocaleDateString()}
                </span>
                <SmartButton
                  count={maintenanceCount}
                  onClick={(e) => handleSmartButtonClick(e, item.id)}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border/50">
          <div className="col-span-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Equipment
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Serial #
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Department
            </span>
          </div>
          <div className="col-span-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </span>
          </div>
          <div className="col-span-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Health
            </span>
          </div>
          <div className="col-span-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Repairs
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Actions
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/50">
          {filteredEquipment.map((item, index) => {
            const status = statusConfig[item.status];
            const StatusIcon = status.icon;
            const health = getHealthBadge(item.status, item.activeRepairs);
            const HealthIcon = health.icon;
            const maintenanceCount = getMaintenanceCount(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors"
              >
                {/* Equipment Name */}
                <div 
                  className="col-span-3 cursor-pointer"
                  onClick={() => onEquipmentClick?.(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last: {new Date(item.lastMaintenance).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Serial Number */}
                <div className="col-span-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {item.serialNumber}
                  </code>
                </div>

                {/* Department */}
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{item.department}</span>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    status.className
                  )}>
                    <StatusIcon className="w-3 h-3" />
                  </span>
                </div>

                {/* Health Badge */}
                <div className="col-span-1">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    health.className
                  )}>
                    <HealthIcon className="w-3 h-3" />
                  </span>
                </div>

                {/* Smart Button */}
                <div className="col-span-1">
                  <SmartButton
                    count={maintenanceCount}
                    onClick={(e) => handleSmartButtonClick(e, item.id)}
                  />
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center gap-2">
                  {onEditClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(item);
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">No equipment found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this equipment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
