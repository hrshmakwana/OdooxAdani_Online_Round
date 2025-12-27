import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { teams as mockTeams, technicians as mockTechnicians, Technician, Team } from '@/data/mockData';

interface TeamsContextType {
  teams: Team[];
  technicians: Technician[];
  loading: boolean;
  addTeam: (name: string, memberIds: string[]) => Promise<void>;
  updateTeam: (id: string, name: string, memberIds: string[]) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addTechnician: (technician: Omit<Technician, 'id'>) => Promise<void>;
  updateTechnician: (id: string, updates: Partial<Technician>) => Promise<void>;
  deleteTechnician: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) {
      setTeams(mockTeams);
      setTechnicians(mockTechnicians);
      return;
    }

    setLoading(true);
    try {
      // Fetch technicians
      const { data: techData, error: techError } = await supabase
        .from('technicians')
        .select('*')
        .order('created_at', { ascending: true });

      if (techError) throw techError;

      const fetchedTechnicians: Technician[] = (techData || []).map(t => ({
        id: t.id,
        name: t.name,
        avatar: t.avatar || t.name.split(' ').map(n => n[0]).join(''),
        specialization: t.specialization || '',
      }));

      // Fetch teams with members
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            technician_id
          )
        `)
        .order('created_at', { ascending: true });

      if (teamsError) throw teamsError;

      const fetchedTeams: Team[] = (teamsData || []).map(team => ({
        id: team.id,
        name: team.name,
        members: (team.team_members || [])
          .map((tm: { technician_id: string }) => fetchedTechnicians.find(t => t.id === tm.technician_id))
          .filter(Boolean) as Technician[],
      }));

      setTechnicians(fetchedTechnicians.length > 0 ? fetchedTechnicians : mockTechnicians);
      setTeams(fetchedTeams.length > 0 ? fetchedTeams : mockTeams);
    } catch (error) {
      console.error('Error fetching teams data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTeam = useCallback(async (name: string, memberIds: string[]) => {
    if (!user) {
      const id = `team${Date.now()}`;
      const members = technicians.filter(t => memberIds.includes(t.id));
      setTeams(prev => [...prev, { id, name, members }]);
      toast({ title: 'Team Created', description: `${name} has been created.` });
      return;
    }

    try {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({ name, user_id: user.id })
        .select()
        .single();

      if (teamError) throw teamError;

      if (memberIds.length > 0) {
        const { error: membersError } = await supabase
          .from('team_members')
          .insert(memberIds.map(techId => ({ team_id: teamData.id, technician_id: techId })));

        if (membersError) throw membersError;
      }

      await fetchData();
      toast({ title: 'Team Created', description: `${name} has been created.` });
    } catch (error) {
      console.error('Error adding team:', error);
      toast({ title: 'Error', description: 'Failed to create team.', variant: 'destructive' });
    }
  }, [user, technicians, fetchData]);

  const updateTeam = useCallback(async (id: string, name: string, memberIds: string[]) => {
    if (!user) {
      const members = technicians.filter(t => memberIds.includes(t.id));
      setTeams(prev => prev.map(t => t.id === id ? { ...t, name, members } : t));
      toast({ title: 'Team Updated', description: 'Team has been updated.' });
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('teams')
        .update({ name })
        .eq('id', id);

      if (updateError) throw updateError;

      // Remove existing members and add new ones
      await supabase.from('team_members').delete().eq('team_id', id);
      
      if (memberIds.length > 0) {
        const { error: membersError } = await supabase
          .from('team_members')
          .insert(memberIds.map(techId => ({ team_id: id, technician_id: techId })));

        if (membersError) throw membersError;
      }

      await fetchData();
      toast({ title: 'Team Updated', description: 'Team has been updated.' });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({ title: 'Error', description: 'Failed to update team.', variant: 'destructive' });
    }
  }, [user, technicians, fetchData]);

  const deleteTeam = useCallback(async (id: string) => {
    if (!user) {
      setTeams(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Team Deleted', description: 'Team has been removed.', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) throw error;

      await fetchData();
      toast({ title: 'Team Deleted', description: 'Team has been removed.', variant: 'destructive' });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({ title: 'Error', description: 'Failed to delete team.', variant: 'destructive' });
    }
  }, [user, fetchData]);

  const addTechnician = useCallback(async (technician: Omit<Technician, 'id'>) => {
    if (!user) {
      const id = `t${Date.now()}`;
      setTechnicians(prev => [...prev, { ...technician, id }]);
      toast({ title: 'Technician Added', description: `${technician.name} has been added.` });
      return;
    }

    try {
      const { error } = await supabase
        .from('technicians')
        .insert({
          name: technician.name,
          avatar: technician.avatar,
          specialization: technician.specialization,
          user_id: user.id,
        });

      if (error) throw error;

      await fetchData();
      toast({ title: 'Technician Added', description: `${technician.name} has been added.` });
    } catch (error) {
      console.error('Error adding technician:', error);
      toast({ title: 'Error', description: 'Failed to add technician.', variant: 'destructive' });
    }
  }, [user, fetchData]);

  const updateTechnician = useCallback(async (id: string, updates: Partial<Technician>) => {
    if (!user) {
      setTechnicians(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      toast({ title: 'Technician Updated', description: 'Technician has been updated.' });
      return;
    }

    try {
      const { error } = await supabase
        .from('technicians')
        .update({
          name: updates.name,
          avatar: updates.avatar,
          specialization: updates.specialization,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({ title: 'Technician Updated', description: 'Technician has been updated.' });
    } catch (error) {
      console.error('Error updating technician:', error);
      toast({ title: 'Error', description: 'Failed to update technician.', variant: 'destructive' });
    }
  }, [user, fetchData]);

  const deleteTechnician = useCallback(async (id: string) => {
    if (!user) {
      setTechnicians(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Technician Deleted', description: 'Technician has been removed.', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('technicians').delete().eq('id', id);
      if (error) throw error;

      await fetchData();
      toast({ title: 'Technician Deleted', description: 'Technician has been removed.', variant: 'destructive' });
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast({ title: 'Error', description: 'Failed to delete technician.', variant: 'destructive' });
    }
  }, [user, fetchData]);

  return (
    <TeamsContext.Provider value={{
      teams,
      technicians,
      loading,
      addTeam,
      updateTeam,
      deleteTeam,
      addTechnician,
      updateTechnician,
      deleteTechnician,
      refreshData: fetchData,
    }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}
