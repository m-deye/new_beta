from django.urls import path
from . import views

urlpatterns = [
    path('api/candidat/<int:candidat_id>/addExperience/', views.create_experience),
    path('api/candidat/<int:candidat_id>/experiences/', views.get_experiences_by_candidat),
    path('api/experience/<int:experience_id>/update/', views.update_experience),
    path('api/experience/<int:experience_id>/delete/', views.delete_experience),
]
