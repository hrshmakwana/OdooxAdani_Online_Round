import { motion } from 'framer-motion';
import { MaintenanceRequest } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar, AlertTriangle, AlertCircle, Info, Flame, GripVertical } from 'lucide-react';

interface KanbanCardProps {
  request: MaintenanceRequest;
  index: number;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  low: {
    label: 'Low',
    icon: Info,
    className: 'bg-muted text-muted-foreground',
  },
  medium: {
    label: 'Medium',
    icon: AlertCircle,
    className: 'bg-primary/10 text-primary',
  },
  high: {
    label: 'High',
    icon: AlertTriangle,
    className: 'bg-warning/10 text-warning',
  },
  critical: {
    label: 'Critical',
    icon: Flame,
    className: 'bg-danger/10 text-danger animate-pulse-glow',
  },
};

export function KanbanCard({ request, index, onClick, isDragging }: KanbanCardProps) {
  const priority = priorityConfig[request.priority];
  const PriorityIcon = priority.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={onClick}
      className={cn(
        'glass-card rounded-lg p-4 cursor-pointer',
        'border border-border/50 hover:border-primary/30',
        'transition-all duration-200',
        isDragging && 'shadow-xl ring-2 ring-primary/30'
      )}
    >
      {/* Header with Priority Badge and Drag Handle */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          priority.className
        )}>
          <PriorityIcon className="w-3 h-3" />
          {priority.label}
        </span>
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
      </div>

      {/* Subject */}
      <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
        {request.subject}
      </h4>

      {/* Equipment Name */}
      <p className="text-xs text-muted-foreground mb-3">
        {request.equipmentName}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        {/* Technician Avatar */}
        {request.assignedTo ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {request.assignedTo.avatar}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {request.assignedTo.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">
            Unassigned
          </span>
        )}

        {/* Scheduled Date */}
        {request.scheduledDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(request.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
