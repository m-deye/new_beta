# parametres/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('ajouter/', views.creer_parametres, name='creer_parametres'),
     path('parametre/liste/', views.liste_parametres, name='liste_parametres'),
    path('modifier/<int:pk>/', views.modifier_parametres, name='modifier_parametres'),
    path('supprimer/<int:pk>/', views.supprimer_parametres, name='supprimer_parametres'),  
]
