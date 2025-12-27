import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTeams } from '@/contexts/TeamsContext';
import { Technician } from '@/data/mockData';

interface TechnicianFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician?: Technician | null;
}

export function TechnicianFormModal({ open, onOpenChange, technician }: TechnicianFormModalProps) {
  const { addTechnician, updateTechnician } = useTeams();
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (technician) {
      setFormData({
        name: technician.name,
        specialization: technician.specialization,
      });
    } else {
      setFormData({ name: '', specialization: '' });
    }
  }, [technician, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const avatar = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      if (technician) {
        await updateTechnician(technician.id, { ...formData, avatar });
      } else {
        await addTechnician({ ...formData, avatar });
      }
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw]">
        <DialogHeader>
          <DialogTitle>{technician ? 'Edit Technician' : 'Add New Technician'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g., Hydraulics, Electrical"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : technician ? 'Update' : 'Add Technician'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
