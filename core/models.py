import uuid
from django.db import models

class MaintenanceTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)

class Technician(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    avatar = models.CharField(max_length=10, blank=True)
    specialization = models.CharField(max_length=100)
    team = models.ForeignKey(MaintenanceTeam, related_name='members', on_delete=models.CASCADE)

class Equipment(models.Model):
    STATUS_CHOICES = [('operational', 'Operational'), ('maintenance', 'Maintenance'), ('repair', 'Repair'), ('scrap', 'Scrap')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=100, unique=True)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='operational')
    last_maintenance = models.DateField(auto_now_add=True)

class MaintenanceRequest(models.Model):
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')]
    STATUS_CHOICES = [('new', 'New'), ('in-progress', 'In Progress'), ('repaired', 'Repaired'), ('scrap', 'Scrap')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject = models.CharField(max_length=255)
    equipment = models.ForeignKey(Equipment, related_name='requests', on_delete=models.CASCADE)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    assigned_to = models.ForeignKey(Technician, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(blank=True, null=True)
    scheduled_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.status == 'scrap':
            self.equipment.status = 'scrap'
            self.equipment.save()
        super().save(*args, **kwargs)