import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EquipmentList } from '@/components/equipment/EquipmentList';
import { EquipmentFormModal } from '@/components/equipment/EquipmentFormModal';
import { useEquipment } from '@/contexts/EquipmentContext';
import { Equipment as EquipmentType } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { exportToCSV, exportToPDF } from '@/lib/exportUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Equipment = () => {
  const navigate = useNavigate();
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useEquipment();
  const [formOpen, setFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentType | undefined>();
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const handleAddClick = () => {
    setEditingEquipment(undefined);
    setFormMode('add');
    setFormOpen(true);
  };

  const handleEditClick = (item: EquipmentType) => {
    setEditingEquipment(item);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<EquipmentType, 'id'>) => {
    if (formMode === 'add') {
      addEquipment(data);
    } else if (editingEquipment) {
      updateEquipment(editingEquipment.id, data);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-background">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Equipment Management</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportToCSV(equipment)}>
              <FileText className="w-4 h-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToPDF(equipment)}>
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EquipmentList 
        equipment={equipment}
        onEquipmentClick={(item) => navigate(`/equipment/${item.id}`)}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={deleteEquipment}
      />

      <EquipmentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        equipment={editingEquipment}
        onSubmit={handleFormSubmit}
        mode={formMode}
      />
    </div>
  );
};

export default Equipment;
