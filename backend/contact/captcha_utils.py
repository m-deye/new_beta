import random
import string
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import base64
import uuid

# Mémoire temporaire pour les captchas
captcha_storage = {}

def generate_captcha_text(length=5):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def create_captcha_token(text):
    token = str(uuid.uuid4())
    captcha_storage[token] = text
    return token

from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import random
import string

def generate_captcha_image(text):
    width, height = 150, 50
    image = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(image)

    # Utiliser une police de caractères par défaut
    try:
        font = ImageFont.truetype("arial.ttf", 30)
    except:
        font = ImageFont.load_default()

    draw.text((10, 10), text, font=font, fill=(0, 0, 0))

    buffer = BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)

    return buffer.getvalue()  # ✅ retourne bien un objet `bytes`




import time
import base64

# durée de validité du captcha : 5 minutes
CAPTCHA_EXPIRATION = 5 * 60  # en secondes

def create_captcha_token(text):
    timestamp = int(time.time())
    token_raw = f"{timestamp}:{text}"
    token_encoded = base64.b64encode(token_raw.encode()).decode()
    return token_encoded

def verify_captcha_token(token, user_input):
    try:
        decoded = base64.b64decode(token).decode()
        timestamp_str, original_text = decoded.split(":")
        timestamp = int(timestamp_str)
        
        if int(time.time()) - timestamp > CAPTCHA_EXPIRATION:
            return False
        
        return original_text.strip().lower() == user_input.strip().lower()
    except Exception:
        return False
