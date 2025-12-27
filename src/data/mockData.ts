// Mock data for GearGuard Enterprise Maintenance Tracker

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  status: 'operational' | 'maintenance' | 'repair' | 'scrap';
  activeRepairs: number;
  lastMaintenance: string;
  image?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  equipmentId: string;
  equipmentName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'repaired' | 'scrap';
  assignedTo?: Technician;
  createdAt: string;
  scheduledDate?: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  members: Technician[];
}

export const technicians: Technician[] = [
  { id: 't1', name: 'Marcus Chen', avatar: 'MC', specialization: 'Hydraulics' },
  { id: 't2', name: 'Sarah Rodriguez', avatar: 'SR', specialization: 'Electrical' },
  { id: 't3', name: 'James Wilson', avatar: 'JW', specialization: 'Pneumatics' },
  { id: 't4', name: 'Emily Park', avatar: 'EP', specialization: 'CNC Systems' },
  { id: 't5', name: 'David Thompson', avatar: 'DT', specialization: 'Robotics' },
];

export const teams: Team[] = [
  { id: 'team1', name: 'Alpha Maintenance', members: [technicians[0], technicians[1]] },
  { id: 'team2', name: 'Beta Engineering', members: [technicians[2], technicians[3]] },
  { id: 'team3', name: 'Delta Robotics', members: [technicians[4]] },
];

export const equipment: Equipment[] = [
  { id: 'eq1', name: 'CNC Lathe XR-500', serialNumber: 'CNC-2024-001', department: 'Production', status: 'operational', activeRepairs: 0, lastMaintenance: '2024-12-15' },
  { id: 'eq2', name: 'Hydraulic Press HP-200', serialNumber: 'HP-2023-042', department: 'Fabrication', status: 'maintenance', activeRepairs: 2, lastMaintenance: '2024-12-01' },
  { id: 'eq3', name: 'Robotic Arm RA-7', serialNumber: 'RA-2024-007', department: 'Assembly', status: 'operational', activeRepairs: 1, lastMaintenance: '2024-12-20' },
  { id: 'eq4', name: 'Conveyor Belt CB-12', serialNumber: 'CB-2022-012', department: 'Logistics', status: 'repair', activeRepairs: 3, lastMaintenance: '2024-11-28' },
  { id: 'eq5', name: 'Welding Station WS-4', serialNumber: 'WS-2023-004', department: 'Fabrication', status: 'operational', activeRepairs: 0, lastMaintenance: '2024-12-18' },
  { id: 'eq6', name: 'Air Compressor AC-100', serialNumber: 'AC-2021-100', department: 'Utilities', status: 'scrap', activeRepairs: 0, lastMaintenance: '2024-10-05' },
  { id: 'eq7', name: 'Laser Cutter LC-3000', serialNumber: 'LC-2024-003', department: 'Production', status: 'operational', activeRepairs: 1, lastMaintenance: '2024-12-22' },
  { id: 'eq8', name: 'Forklift FL-50', serialNumber: 'FL-2020-050', department: 'Logistics', status: 'maintenance', activeRepairs: 1, lastMaintenance: '2024-12-10' },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  { id: 'mr1', subject: 'Unusual vibration during operation', equipmentId: 'eq2', equipmentName: 'Hydraulic Press HP-200', priority: 'high', status: 'new', createdAt: '2024-12-25', description: 'Noticed excessive vibration when operating at full capacity' },
  { id: 'mr2', subject: 'Calibration required', equipmentId: 'eq7', equipmentName: 'Laser Cutter LC-3000', priority: 'medium', status: 'new', createdAt: '2024-12-26', description: 'Cutting precision has decreased by 0.5mm' },
  { id: 'mr3', subject: 'Oil leak detected', equipmentId: 'eq2', equipmentName: 'Hydraulic Press HP-200', priority: 'critical', status: 'in-progress', assignedTo: technicians[0], createdAt: '2024-12-24', scheduledDate: '2024-12-27' },
  { id: 'mr4', subject: 'Servo motor replacement', equipmentId: 'eq3', equipmentName: 'Robotic Arm RA-7', priority: 'high', status: 'in-progress', assignedTo: technicians[4], createdAt: '2024-12-23', scheduledDate: '2024-12-28' },
  { id: 'mr5', subject: 'Belt tension adjustment', equipmentId: 'eq4', equipmentName: 'Conveyor Belt CB-12', priority: 'medium', status: 'in-progress', assignedTo: technicians[2], createdAt: '2024-12-22' },
  { id: 'mr6', subject: 'Annual maintenance completed', equipmentId: 'eq1', equipmentName: 'CNC Lathe XR-500', priority: 'low', status: 'repaired', assignedTo: technicians[3], createdAt: '2024-12-20' },
  { id: 'mr7', subject: 'Bearing replacement', equipmentId: 'eq5', equipmentName: 'Welding Station WS-4', priority: 'medium', status: 'repaired', assignedTo: technicians[1], createdAt: '2024-12-19' },
  { id: 'mr8', subject: 'Motor burnout - unrepairable', equipmentId: 'eq6', equipmentName: 'Air Compressor AC-100', priority: 'critical', status: 'scrap', createdAt: '2024-12-15', description: 'Motor has completely failed, replacement cost exceeds equipment value' },
  { id: 'mr9', subject: 'Sensor malfunction', equipmentId: 'eq4', equipmentName: 'Conveyor Belt CB-12', priority: 'high', status: 'new', createdAt: '2024-12-27' },
  { id: 'mr10', subject: 'Hydraulic fluid change', equipmentId: 'eq8', equipmentName: 'Forklift FL-50', priority: 'low', status: 'in-progress', assignedTo: technicians[0], createdAt: '2024-12-26' },
];

export const dashboardStats = {
  totalEquipment: equipment.length,
  operationalEquipment: equipment.filter(e => e.status === 'operational').length,
  pendingRequests: maintenanceRequests.filter(r => r.status === 'new').length,
  inProgressRequests: maintenanceRequests.filter(r => r.status === 'in-progress').length,
  completedThisMonth: maintenanceRequests.filter(r => r.status === 'repaired').length,
  averageResolutionTime: '2.4 days',
};
