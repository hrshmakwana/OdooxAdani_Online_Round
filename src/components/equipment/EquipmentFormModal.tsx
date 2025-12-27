import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Equipment } from '@/data/mockData';

interface EquipmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment;
  onSubmit: (data: Omit<Equipment, 'id'>) => void;
  mode: 'add' | 'edit';
}

const departments = ['Production', 'Fabrication', 'Assembly', 'Logistics', 'Utilities', 'Quality Control'];
const statuses: Equipment['status'][] = ['operational', 'maintenance', 'repair', 'scrap'];

export function EquipmentFormModal({ open, onOpenChange, equipment, onSubmit, mode }: EquipmentFormModalProps) {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    serialNumber: equipment?.serialNumber || '',
    department: equipment?.department || '',
    status: equipment?.status || 'operational' as Equipment['status'],
    activeRepairs: equipment?.activeRepairs || 0,
    lastMaintenance: equipment?.lastMaintenance || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.serialNumber || !formData.department) {
      return;
    }
    onSubmit(formData);
    onOpenChange(false);
    // Reset form for next use
    if (mode === 'add') {
      setFormData({
        name: '',
        serialNumber: '',
        department: '',
        status: 'operational',
        activeRepairs: 0,
        lastMaintenance: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Equipment' : 'Edit Equipment'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Register a new machine to the system.' : 'Update equipment details.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., CNC Lathe XR-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number *</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              placeholder="e.g., CNC-2024-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Equipment['status'] }))}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
            <Input
              id="lastMaintenance"
              type="date"
              value={formData.lastMaintenance}
              onChange={(e) => setFormData(prev => ({ ...prev, lastMaintenance: e.target.value }))}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Equipment' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
