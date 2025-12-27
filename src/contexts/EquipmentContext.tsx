import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Equipment } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface EquipmentContextType {
  equipment: Equipment[];
  loading: boolean;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (id: string, updates: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  refreshEquipment: () => Promise<void>;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export function EquipmentProvider({ children }: { children: React.ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/equipment/`);
      const mapped: Equipment[] = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        serialNumber: item.serial_number,
        department: item.department,
        status: item.status,
        activeRepairs: item.active_repairs || 0,
        lastMaintenance: item.last_maintenance || '',
      }));
      setEquipment(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const addEquipment = async (newEq: Omit<Equipment, 'id'>) => {
    try {
      await axios.post(`${API_BASE_URL}/equipment/`, {
        name: newEq.name,
        serial_number: newEq.serialNumber,
        department: newEq.department,
        status: newEq.status,
      });
      toast({ title: 'Success', description: 'Equipment saved to local PostgreSQL.' });
      fetchEquipment();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add equipment. Serial Number must be unique.', variant: 'destructive' });
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const payload: any = {};
      if (updates.name) payload.name = updates.name;
      if (updates.status) payload.status = updates.status;
      if (updates.department) payload.department = updates.department;
      
      await axios.patch(`${API_BASE_URL}/equipment/${id}/`, payload);
      fetchEquipment();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/equipment/${id}/`);
      fetchEquipment();
      toast({ title: 'Deleted', variant: 'destructive' });
    } catch (error) {
      console.error(error);
    }
  };

  const getEquipmentById = useCallback((id: string) => {
    return equipment.find(e => e.id === id);
  }, [equipment]);

  return (
    <EquipmentContext.Provider value={{ 
      equipment, 
      loading, 
      addEquipment, 
      updateEquipment, 
      deleteEquipment, 
      getEquipmentById, 
      refreshEquipment: fetchEquipment 
    }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) throw new Error('useEquipment must be used within an EquipmentProvider');
  return context;
}