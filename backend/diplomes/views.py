# diplomes/views.py
from urllib import response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
import json
from diplomes.serializers import DiplomeSerializer
from offres_emploi.models import Candidat
from .models import Diplome
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DiplomeSerializer
from rest_framework import status

@api_view(['POST'])
def create_diplome(request, candidat_id):
    data = request.data.copy()
    data['candidat'] = candidat_id  # ou 'candidat_id' selon ton serializer
    serializer = DiplomeSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_diplomes_by_candidat(request, candidat_id):
    diplomes = Diplome.objects.filter(candidat_id=candidat_id)
    serializer = DiplomeSerializer(diplomes, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_diplome(request, diplome_id):
    try:
        diplome = Diplome.objects.get(id=diplome_id)
        diplome.delete()
        return Response({'message': 'Diplôme supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except Diplome.DoesNotExist:
        return Response({'error': 'Diplôme non trouvé'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['PUT'])
def update_diplome(request, diplome_id):
    try:
        diplome = Diplome.objects.get(id=diplome_id)
    except Diplome.DoesNotExist:
        return Response({"error": "Diplôme non trouvé"}, status=404)

    serializer = DiplomeSerializer(diplome, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


