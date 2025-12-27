import { useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'preventive' | 'corrective';
  equipmentName?: string;
  status: string;
  priority: string;
}

interface MaintenanceCalendarProps {
  onDateClick?: (date: Date) => void;
}

export function MaintenanceCalendar({ onDateClick }: MaintenanceCalendarProps) {
  const { requests } = useMaintenanceRequests();

  // Convert maintenance requests to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return requests.map(request => {
      // Determine type based on priority or subject keywords
      const isPreventive = request.subject.toLowerCase().includes('preventive') ||
        request.subject.toLowerCase().includes('pm') ||
        request.subject.toLowerCase().includes('inspection') ||
        request.subject.toLowerCase().includes('maintenance') ||
        request.subject.toLowerCase().includes('calibration') ||
        request.subject.toLowerCase().includes('cleaning') ||
        request.priority === 'low';
      
      const eventDate = request.scheduledDate 
        ? new Date(request.scheduledDate)
        : new Date(request.createdAt);
      
      // Set proper start and end times
      const start = new Date(eventDate);
      start.setHours(9, 0, 0, 0);
      
      const end = new Date(eventDate);
      end.setHours(12, 0, 0, 0);

      return {
        id: request.id,
        title: `${request.subject} - ${request.equipmentName}`,
        start,
        end,
        type: isPreventive ? 'preventive' : 'corrective',
        equipmentName: request.equipmentName,
        status: request.status,
        priority: request.priority,
      };
    });
  }, [requests]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const isPreventive = event.type === 'preventive';
    return {
      style: {
        backgroundColor: isPreventive ? 'hsl(224, 76%, 33%)' : 'hsl(0, 72%, 51%)',
        borderRadius: '6px',
        border: 'none',
        color: 'white',
        fontWeight: 500,
        fontSize: '0.75rem',
        padding: '2px 8px',
      },
    };
  }, []);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    onDateClick?.(slotInfo.start);
  }, [onDateClick]);

  const { views, defaultView } = useMemo(() => ({
    views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
    defaultView: Views.MONTH,
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-4 md:p-6"
    >
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-foreground">Preventive Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-sm text-foreground">Corrective (Deadlines)</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="h-[600px] calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={views}
          defaultView={defaultView}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          popup
          className="rounded-lg"
        />
      </div>
    </motion.div>
  );
}
