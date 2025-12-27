import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEquipment } from '@/contexts/EquipmentContext';
import { useMaintenanceRequests } from '@/contexts/MaintenanceRequestsContext';
import { useRole } from '@/contexts/RoleContext';
import { Header } from '@/components/layout/Header';
import { SmartButton } from '@/components/equipment/SmartButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Wrench, Calendar, MapPin, Activity, FileText } from 'lucide-react';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEquipmentById } = useEquipment();
  const { requests } = useMaintenanceRequests();
  
  const item = getEquipmentById(id || '');
  if (!item) return <div className="p-8 text-center"><Button onClick={() => navigate('/equipment')}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button></div>;

  const activeMaintenanceCount = requests.filter(r => r.equipmentId === id && r.status !== 'repaired' && r.status !== 'scrap').length;
  const relatedRequests = requests.filter(r => r.equipmentId === id);

  return (
    <div className="flex-1 p-4 md:p-6 bg-background space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/equipment')}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <code className="text-sm text-muted-foreground">{item.serialNumber}</code>
          </div>
        </div>
        <SmartButton count={activeMaintenanceCount} onClick={() => navigate(`/?equipment=${id}`)} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="gap-2"><Activity className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><Calendar className="w-4 h-4" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Department</span><span className="text-sm font-medium">{item.department}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Status</span><span className="capitalize text-sm font-medium">{item.status}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Last Maintenance</span><span className="text-sm font-medium">{new Date(item.lastMaintenance).toLocaleDateString()}</span></div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/50">
            {relatedRequests.length > 0 ? relatedRequests.map((r) => (
              <div key={r.id} className="p-4">
                <div className="flex justify-between">
                  <div><p className="font-medium">{r.subject}</p><p className="text-xs text-muted-foreground">{r.description}</p></div>
                  <div className="text-right"><span className="text-xs font-bold uppercase">{r.status}</span><p className="text-[10px]">{r.createdAt}</p></div>
                </div>
              </div>
            )) : <div className="p-8 text-center text-muted-foreground">No history available</div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}