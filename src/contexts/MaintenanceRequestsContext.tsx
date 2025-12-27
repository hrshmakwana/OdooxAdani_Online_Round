import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { MaintenanceRequest, Technician } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface MaintenanceRequestsContextType {
  requests: MaintenanceRequest[];
  loading: boolean;
  addRequest: (request: any) => Promise<void>;
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  updateStatus: (id: string, status: MaintenanceRequest['status']) => Promise<void>;
  assignTechnician: (requestId: string, technician: Technician) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const MaintenanceRequestsContext = createContext<MaintenanceRequestsContextType | undefined>(undefined);

export function MaintenanceRequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/requests/`);
      const mapped: MaintenanceRequest[] = response.data.map((item: any) => ({
        id: item.id,
        subject: item.subject,
        equipmentId: item.equipment,
        equipmentName: item.equipment_name,
        priority: item.priority,
        status: item.status,
        description: item.description,
        scheduledDate: item.scheduled_date,
        createdAt: item.created_at?.split('T')[0],
      }));
      setRequests(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const addRequest = async (newReq: any) => {
    try {
      const payload = {
        subject: newReq.subject,
        equipment: newReq.equipmentId,
        priority: newReq.priority,
        status: newReq.status || 'new',
        description: newReq.description,
        scheduled_date: newReq.scheduledDate,
      };
      await axios.post(`${API_BASE_URL}/requests/`, payload);
      toast({ title: 'Request Created' });
      fetchRequests();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const payload: any = {};
      if (updates.subject) payload.subject = updates.subject;
      if (updates.status) payload.status = updates.status;
      if (updates.priority) payload.priority = updates.priority;
      if (updates.scheduledDate) payload.scheduled_date = updates.scheduledDate;

      await axios.patch(`${API_BASE_URL}/requests/${id}/`, payload);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = (id: string, status: MaintenanceRequest['status']) => updateRequest(id, { status });

  const assignTechnician = async (requestId: string, tech: Technician) => {
    try {
      await axios.patch(`${API_BASE_URL}/requests/${requestId}/`, { assigned_to: tech.id });
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/requests/${id}/`);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MaintenanceRequestsContext.Provider value={{
      requests,
      loading,
      addRequest,
      updateRequest,
      deleteRequest,
      updateStatus,
      assignTechnician,
      refreshRequests: fetchRequests,
    }}>
      {children}
    </MaintenanceRequestsContext.Provider>
  );
}

export function useMaintenanceRequests() {
  const context = useContext(MaintenanceRequestsContext);
  if (!context) throw new Error('useMaintenanceRequests must be used within a MaintenanceRequestsProvider');
  return context;
}