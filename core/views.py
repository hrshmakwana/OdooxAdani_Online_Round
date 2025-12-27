from django.db import models
from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Count
from .models import Equipment, MaintenanceRequest, Technician, MaintenanceTeam
from .serializers import EquipmentSerializer, MaintenanceRequestSerializer, TechnicianSerializer, MaintenanceTeamSerializer

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    def list(self, request):
        queryset = Equipment.objects.annotate(
            active_repairs=Count(
                'requests', 
                filter=models.Q(requests__status__in=['new', 'in-progress'])
            )
        )
        serializer = EquipmentSerializer(queryset, many=True)
        return Response(serializer.data)

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all().order_by('-created_at')
    serializer_class = MaintenanceRequestSerializer

class TechnicianViewSet(viewsets.ModelViewSet):
    queryset = Technician.objects.all()
    serializer_class = TechnicianSerializer

class MaintenanceTeamViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTeam.objects.all()
    serializer_class = MaintenanceTeamSerializer