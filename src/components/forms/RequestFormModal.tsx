import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEquipment } from '@/contexts/EquipmentContext';
import { useTeams } from '@/contexts/TeamsContext';
import { cn } from '@/lib/utils';

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultDate?: Date;
}

export function RequestFormModal({ isOpen, onClose, onSubmit, defaultDate }: RequestFormModalProps) {
  const { equipment } = useEquipment();
  const { technicians, teams } = useTeams();
  
  const [formData, setFormData] = useState({
    subject: '',
    equipmentId: '',
    teamId: '',
    scheduledDate: defaultDate ? defaultDate.toISOString().split('T')[0] : '',
    priority: 'medium',
    assignedToId: '',
    isRecurring: false,
    repeatEvery: 1,
    frequency: 'weeks',
    requestType: 'corrective',
  });
  
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        scheduledDate: defaultDate.toISOString().split('T')[0],
      }));
    }
  }, [defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.equipmentId) {
      setErrors({ subject: !formData.subject, equipmentId: !formData.equipmentId });
      return;
    }
    onSubmit(formData);
    onClose();
    setFormData({
      subject: '',
      equipmentId: '',
      teamId: '',
      scheduledDate: '',
      priority: 'medium',
      assignedToId: '',
      isRecurring: false,
      repeatEvery: 1,
      frequency: 'weeks',
      requestType: 'corrective',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={onClose} className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg glass-card rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Maintenance Request</h2>
              <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={cn(errors.subject && "border-danger")} />
              </div>
              <div className="space-y-2">
                <Label>Equipment</Label>
                <Select value={formData.equipmentId} onValueChange={(val) => setFormData({ ...formData, equipmentId: val })}>
                  <SelectTrigger className={cn(errors.equipmentId && "border-danger")}>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.filter(e => e.status !== 'scrap').map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Request</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}