# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Langue
from .serializers import LangueSerializer

@api_view(['POST'])
def create_langue(request, candidat_id):
    print(candidat_id)
    data = request.data.copy()
    data['candidat'] = candidat_id
    serializer = LangueSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_Langues_by_candidat(request, candidat_id):
    Langues = Langue.objects.filter(candidat_id=candidat_id)
    serializer = LangueSerializer(Langues, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_langue(request, langue_id):
    try:
        langue = Langue.objects.get(id=langue_id)
    except Langue.DoesNotExist:
        return Response({"error": "Langue non trouvée"}, status=404)

    serializer = LangueSerializer(langue, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_langue(request,langue_id):
    try:
        diplome = Langue.objects.get(id=langue_id)
        diplome.delete()
        return Response({'message': 'Languesupprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except Langue.DoesNotExist:
        return Response({'error': 'Langue non trouvé'}, status=status.HTTP_404_NOT_FOUND)

