import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTeams } from '@/contexts/TeamsContext';
import { useSearch } from '@/contexts/SearchContext';
import { Users, Plus, Pencil, Trash2, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamFormModal } from '@/components/teams/TeamFormModal';
import { TechnicianFormModal } from '@/components/teams/TechnicianFormModal';
import { Team, Technician } from '@/data/mockData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Teams = () => {
  const { teams, technicians, loading, deleteTeam, deleteTechnician } = useTeams();
  const { searchQuery: globalSearch } = useSearch();
  const [localSearch, setLocalSearch] = useState('');
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [deleteTechId, setDeleteTechId] = useState<string | null>(null);

  const query = globalSearch || localSearch;
  
  const filteredTeams = useMemo(() => {
    return teams.filter(team =>
      team.name.toLowerCase().includes(query.toLowerCase()) ||
      team.members.some(m => m.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [teams, query]);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter(tech =>
      tech.name.toLowerCase().includes(query.toLowerCase()) ||
      tech.specialization.toLowerCase().includes(query.toLowerCase())
    );
  }, [technicians, query]);

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamModalOpen(true);
  };

  const handleEditTech = (tech: Technician) => {
    setEditingTech(tech);
    setTechModalOpen(true);
  };

  const handleDeleteTeam = async () => {
    if (deleteTeamId) {
      await deleteTeam(deleteTeamId);
      setDeleteTeamId(null);
    }
  };

  const handleDeleteTech = async () => {
    if (deleteTechId) {
      await deleteTechnician(deleteTechId);
      setDeleteTechId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-6 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 bg-background">
      <Tabs defaultValue="teams" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="teams" className="flex-1 sm:flex-none">Teams</TabsTrigger>
            <TabsTrigger value="technicians" className="flex-1 sm:flex-none">Technicians</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={() => { setEditingTeam(null); setTeamModalOpen(true); }} size="sm" className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-1" /> New Team
            </Button>
            <Button onClick={() => { setEditingTech(null); setTechModalOpen(true); }} size="sm" variant="outline" className="flex-1 sm:flex-none">
              <UserPlus className="w-4 h-4 mr-1" /> Add Technician
            </Button>
          </div>
        </div>

        {/* Local Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams and technicians..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>

        <TabsContent value="teams">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card-hover rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditTeam(team)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTeamId(team.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {team.members.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No members assigned</p>
                  ) : (
                    team.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">{member.avatar}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.specialization}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="technicians">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {filteredTechnicians.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">{tech.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{tech.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{tech.specialization}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditTech(tech)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTechId(tech.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      <TeamFormModal open={teamModalOpen} onOpenChange={setTeamModalOpen} team={editingTeam} />
      <TechnicianFormModal open={techModalOpen} onOpenChange={setTechModalOpen} technician={editingTech} />

      <AlertDialog open={!!deleteTeamId} onOpenChange={() => setDeleteTeamId(null)}>
        <AlertDialogContent className="max-w-md w-[95vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this team.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTechId} onOpenChange={() => setDeleteTechId(null)}>
        <AlertDialogContent className="max-w-md w-[95vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Technician?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this technician.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTech} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Teams;
