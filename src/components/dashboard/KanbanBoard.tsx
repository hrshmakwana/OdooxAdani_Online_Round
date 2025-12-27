import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MaintenanceRequest, Technician } from '@/data/mockData';
import { KanbanCard } from './KanbanCard';
import { useTeams } from '@/contexts/TeamsContext';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import { useRole } from '@/contexts/RoleContext';
import { cn } from '@/lib/utils';
import { Plus, Inbox, Clock, CheckCircle2, Trash2, UserPlus, UserCheck, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface KanbanColumn {
  id: string;
  title: string;
  status: MaintenanceRequest['status'];
  icon: React.ElementType;
  color: 'default' | 'warning' | 'success' | 'danger';
  bgClass: string;
}

const columns: KanbanColumn[] = [
  { 
    id: 'new', 
    title: 'New Requests', 
    status: 'new', 
    icon: Inbox,
    color: 'default',
    bgClass: 'bg-muted/30'
  },
  { 
    id: 'in-progress', 
    title: 'In Progress', 
    status: 'in-progress', 
    icon: Clock,
    color: 'warning',
    bgClass: 'bg-warning/5'
  },
  { 
    id: 'repaired', 
    title: 'Repaired', 
    status: 'repaired', 
    icon: CheckCircle2,
    color: 'success',
    bgClass: 'bg-success/5'
  },
  { 
    id: 'scrap', 
    title: 'Scrap', 
    status: 'scrap', 
    icon: Trash2,
    color: 'danger',
    bgClass: 'bg-danger/5'
  },
];

const headerColors = {
  default: 'text-muted-foreground',
  warning: 'text-warning',
  success: 'text-success',
  danger: 'text-danger',
};

const countColors = {
  default: 'bg-muted text-muted-foreground',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
};

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onCardClick?: (request: MaintenanceRequest) => void;
  onStatusChange?: (requestId: string, newStatus: MaintenanceRequest['status']) => void;
}

export function KanbanBoard({ requests, onCardClick, onStatusChange }: KanbanBoardProps) {
  const [items, setItems] = useState(requests);
  const { technicians } = useTeams();
  const { assignTechnician } = useMaintenanceRequests();
  const { isTechnician, isManager, canAssignTechnicians, canAcceptTasks, canUpdateTaskStatus, currentUser } = useRole();

  // Sync items with requests prop
  useEffect(() => {
    setItems(requests);
  }, [requests]);

  const getRequestsByStatus = (status: MaintenanceRequest['status']) => {
    return items.filter(r => r.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Check if user has permission to update status
    if (!canUpdateTaskStatus) {
      toast.error('You do not have permission to change task status');
      return;
    }

    const newStatus = destination.droppableId as MaintenanceRequest['status'];
    
    setItems(prev => 
      prev.map(item => 
        item.id === draggableId 
          ? { ...item, status: newStatus }
          : item
      )
    );

    onStatusChange?.(draggableId, newStatus);
    toast.success(`Task moved to ${columns.find(c => c.status === newStatus)?.title}`);
  };

  const handleAssignTechnician = async (requestId: string, technician: Technician) => {
    if (!canAssignTechnicians) {
      toast.error('You do not have permission to assign technicians');
      return;
    }
    await assignTechnician(requestId, technician);
    setItems(prev => 
      prev.map(item => 
        item.id === requestId 
          ? { ...item, assignedTo: technician }
          : item
      )
    );
    toast.success(`Assigned to ${technician.name}`);
  };

  // Allow technician to accept/claim an unassigned task
  const handleAcceptTask = async (requestId: string) => {
    if (!canAcceptTasks) {
      toast.error('You do not have permission to accept tasks');
      return;
    }
    
    // Find a technician matching current user (in real app, this would be the logged-in user's technician record)
    const selfTechnician = technicians.find(t => 
      t.name.toLowerCase().includes(currentUser.name.toLowerCase())
    ) || technicians[0]; // Fallback to first technician for demo
    
    if (selfTechnician) {
      await assignTechnician(requestId, selfTechnician);
      setItems(prev => 
        prev.map(item => 
          item.id === requestId 
            ? { ...item, assignedTo: selfTechnician }
            : item
        )
      );
      toast.success('Task accepted! You are now assigned to this task.');
    }
  };

  // Start working on a task (move to in-progress)
  const handleStartTask = async (requestId: string) => {
    if (!canUpdateTaskStatus) {
      toast.error('You do not have permission to update task status');
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.id === requestId 
          ? { ...item, status: 'in-progress' as const }
          : item
      )
    );
    onStatusChange?.(requestId, 'in-progress');
    toast.success('Task started! Moved to In Progress.');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {columns.map((column, columnIndex) => {
          const columnRequests = getRequestsByStatus(column.status);
          const Icon = column.icon;
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: columnIndex * 0.1 }}
              className={cn(
                'rounded-xl p-4 min-h-[500px] flex flex-col',
                column.bgClass
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', headerColors[column.color])} />
                  <h3 className={cn('font-semibold text-sm', headerColors[column.color])}>
                    {column.title}
                  </h3>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    countColors[column.color]
                  )}>
                    {columnRequests.length}
                  </span>
                </div>
                {column.status === 'new' && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Droppable Cards Container */}
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex flex-col gap-3 flex-1 rounded-lg transition-colors min-h-[200px]',
                      snapshot.isDraggingOver && 'bg-primary/5 ring-2 ring-primary/20'
                    )}
                  >
                    {columnRequests.map((request, index) => (
                      <Draggable key={request.id} draggableId={request.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                          >
                            <motion.div
                              animate={snapshot.isDragging ? { scale: 1.02, rotate: 2 } : { scale: 1, rotate: 0 }}
                              transition={{ duration: 0.2 }}
                              className="relative group"
                            >
                              <KanbanCard
                                request={request}
                                index={index}
                                onClick={() => onCardClick?.(request)}
                                isDragging={snapshot.isDragging}
                              />
                              
                              {/* Action buttons for technicians and managers */}
                              <div className="absolute top-2 right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Accept Task (for unassigned tasks) */}
                                {!request.assignedTo && canAcceptTasks && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-success/10 hover:bg-success/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptTask(request.id);
                                    }}
                                    title="Accept this task"
                                  >
                                    <UserCheck className="w-3 h-3 text-success" />
                                  </Button>
                                )}
                                
                                {/* Start Task (for new tasks) */}
                                {request.status === 'new' && request.assignedTo && canUpdateTaskStatus && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-primary/10 hover:bg-primary/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartTask(request.id);
                                    }}
                                    title="Start working on this task"
                                  >
                                    <Play className="w-3 h-3 text-primary" />
                                  </Button>
                                )}
                                
                                {/* Assign Technician (managers only) */}
                                {canAssignTechnicians && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <UserPlus className="w-3 h-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
                                      <DropdownMenuLabel>Assign Technician</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      {technicians.map((tech) => (
                                        <DropdownMenuItem
                                          key={tech.id}
                                          onClick={() => handleAssignTechnician(request.id, tech)}
                                          className="cursor-pointer"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                              <span className="text-xs font-semibold text-primary">
                                                {tech.avatar}
                                              </span>
                                            </div>
                                            <div>
                                              <div className="text-sm">{tech.name}</div>
                                              <div className="text-xs text-muted-foreground">{tech.specialization}</div>
                                            </div>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnRequests.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground/50 text-center">
                          No items
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
          );
        })}
      </motion.div>
    </DragDropContext>
  );
}
