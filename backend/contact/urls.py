from django.urls import path
from .views import captcha_view
from .views import send_message

urlpatterns = [
    # path('sendMessage/', envoyer_message, name='envoyer_message'),
    # path('get-captcha/', views.get_captcha),
    # path('sendMessage/', send_message),  # ta vue d'envoi de message
    #   path('sendMessage/', envoyer_message),
    # path('captcha/', generate_captcha),  # pour obtenir l'image

    path('captcha/',captcha_view, name='captcha_view'),
    path('sendMessage/', send_message, name='send_message'),

    
]
