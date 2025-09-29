# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/candidat/<int:candidat_id>/addLangue/', views.create_langue),

    path('api/candidat/<int:candidat_id>/langues/', views.get_Langues_by_candidat),
    path('api/langue/<int:langue_id>/update/', views.update_langue),

     path('api/langues/<int:langue_id>/delete/', views.delete_langue),
]
