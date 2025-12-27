from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import EquipmentViewSet, MaintenanceRequestViewSet, TechnicianViewSet

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet)
router.register(r'requests', MaintenanceRequestViewSet)
router.register(r'technicians', TechnicianViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]