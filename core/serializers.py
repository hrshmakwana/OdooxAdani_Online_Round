from rest_framework import serializers
from .models import Equipment, MaintenanceRequest, Technician, MaintenanceTeam

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    equipment_name = serializers.ReadOnlyField(source='equipment.name')
    class Meta:
        model = MaintenanceRequest
        fields = '__all__'

class TechnicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technician
        fields = '__all__'

class MaintenanceTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceTeam
        fields = '__all__'