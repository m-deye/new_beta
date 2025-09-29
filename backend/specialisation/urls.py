from django.urls import path
from . import views

urlpatterns = [
  
    path('api/specialisation/<int:specialisation_id>/update/', views.update_specialisation),

      path('api/specialisation/<int:candidat_id>/addspecialisation/', views.create_specialisation),
   
]