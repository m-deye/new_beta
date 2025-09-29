import random
import string
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from django.http import HttpResponse, JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

from .models import ContactMessage

from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import random, string
from django.http import HttpResponse

from django.views.decorators.http import require_GET
from django.http import JsonResponse, HttpResponse
from .captcha_utils import generate_captcha_text, create_captcha_token, generate_captcha_image

@require_GET
def captcha_view(request):
    text = generate_captcha_text()
    token = create_captcha_token(text)
    image_bytes = generate_captcha_image(text)  # c’est bien des `bytes`

    import base64
    image_base64 = base64.b64encode(image_bytes).decode()

    return JsonResponse({
        "captcha_image": f"data:image/png;base64,{image_base64}",
        "captcha_token": token
    })


from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from .models import ContactMessage
from .captcha_utils import verify_captcha_token

@csrf_exempt
@require_POST
def send_message(request):
    try:
        data = json.loads(request.body)
        print(data)
    except Exception:
        return JsonResponse({'error': 'Données invalides.'}, status=400)

    user_captcha = data.get('captcha', '').strip()
    token = data.get('captcha_token', '').strip()

    if not verify_captcha_token(token, user_captcha):
        return JsonResponse({'error': 'Captcha invalide ou expiré.'}, status=400)

    try:
        msg = ContactMessage.objects.create(
            nom=data['nom'],
            email=data['email'],
            sujet=data['sujet'],
            description=data['description']
        )
        print(msg)
        # Envoi email (ajuste selon ta config)
        from django.conf import settings
        from django.core.mail import send_mail

        send_mail(
            subject=f"[Contact] {msg.sujet}",
            message=f"Nom: {msg.nom}\nEmail: {msg.email}\n\nMessage:\n{msg.description}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['selmatesttestselma@gmail.com'],
            fail_silently=False,
        )

        return JsonResponse({'message': 'Message envoyé avec succès !'})

    except Exception as e:
        return JsonResponse({'error': f"Erreur serveur : {str(e)}"}, status=500)

