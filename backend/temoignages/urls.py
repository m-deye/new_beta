from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import TemoignageCreateView

urlpatterns = [
    path('api/temoignages/create/', TemoignageCreateView.as_view(), name='temoignage_create'),
]