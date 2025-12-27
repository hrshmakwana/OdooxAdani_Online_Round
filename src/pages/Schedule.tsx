import { useState } from 'react';
import { MaintenanceCalendar } from '@/components/schedule/MaintenanceCalendar';
import { RequestFormModal } from '@/components/forms/RequestFormModal';
import { useEquipment } from '@/contexts/EquipmentContext';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Schedule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { equipment } = useEquipment();
  const { addRequest } = useMaintenanceRequests();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    const selectedEquipment = equipment.find(e => e.id === data.equipmentId);
    await addRequest({
      subject: data.subject,
      equipmentId: data.equipmentId,
      equipmentName: selectedEquipment?.name || 'Unknown Equipment',
      priority: data.priority,
      status: 'new',
      scheduledDate: data.scheduledDate || selectedDate?.toISOString().split('T')[0],
    });
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-background">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Maintenance Schedule</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Schedule Request</span>
        </Button>
      </div>

      <MaintenanceCalendar onDateClick={handleDateClick} />

      <RequestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default Schedule;
