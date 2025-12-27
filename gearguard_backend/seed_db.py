import os
import sys
import django
from pathlib import Path

# --- THE FIX: This manually tells Python where your project is ---
# It finds the folder containing this script and adds it to Python's "brain"
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gearguard_backend.settings')

try:
    django.setup()
except Exception as e:
    print(f"❌ Error during Django setup: {e}")
    sys.exit(1)

# Import models AFTER django.setup()
from core.models import Equipment, MaintenanceTeam, Technician, MaintenanceRequest

def seed():
    print("🚀 Seeding database with Odoo-compliant data...")
    
    # 1. Clean existing data to avoid duplicates
    MaintenanceRequest.objects.all().delete()
    Technician.objects.all().delete()
    Equipment.objects.all().delete()
    MaintenanceTeam.objects.all().delete()

    # 2. Create Teams (Odoo Logic: specialized teams)
    team_alpha = MaintenanceTeam.objects.create(name="Alpha Maintenance (Mechanics)")
    team_beta = MaintenanceTeam.objects.create(name="Beta Engineering (Electrical)")
    
    # 3. Create Technicians linked to Teams
    tech1 = Technician.objects.create(name="Marcus Chen", specialization="Hydraulics", team=team_alpha, avatar="MC")
    tech2 = Technician.objects.create(name="Sarah Rodriguez", specialization="Electrical", team=team_beta, avatar="SR")
    
    # 4. Create Equipment
    eq1 = Equipment.objects.create(
        name="CNC Lathe XR-500", 
        serial_number="CNC-2024-001", 
        department="Production", 
        status="operational"
    )
    eq2 = Equipment.objects.create(
        name="Hydraulic Press HP-200", 
        serial_number="HP-2023-042", 
        department="Fabrication", 
        status="maintenance"
    )
    
    # 5. Create Initial Requests (transactional history)
    MaintenanceRequest.objects.create(
        subject="Annual maintenance checkup",
        equipment=eq1,
        priority="low",
        status="new",
        description="Routine preventive inspection."
    )
    
    MaintenanceRequest.objects.create(
        subject="Oil leak detected",
        equipment=eq2,
        priority="critical",
        status="in-progress",
        assigned_to=tech1,
        description="Severe leak near main piston."
    )

    print("✅ Done! Database is now populated and ready for your demo.")

if __name__ == '__main__':
    seed()