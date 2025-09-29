
from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views


urlpatterns = [
  path('api/candidat/<int:candidat_id>/addDiplome/', views.create_diplome, name='update_candidat_specialisation'),
    path('api/candidat/<int:candidat_id>/diplomes/', views.get_diplomes_by_candidat, name='update_candidat_specialisation'),
    path('api/diplome/<int:diplome_id>/delete/', views.delete_diplome, name='delete_diplome'),
    path('api/diplome/<int:diplome_id>/update/', views.update_diplome),


  ]