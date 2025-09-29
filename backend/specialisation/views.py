
from .models import Specialisation
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import SpecialisationSerializer

@api_view(['PUT'])
def update_specialisation(request, specialisation_id):
    try:
        Specialisation = Specialisation.objects.get(id=specialisation_id)
    except Specialisation.DoesNotExist:
        return Response({"error": "specialisation non trouvée"}, status=404)

    serializer = SpecialisationSerializer(Specialisation, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def create_specialisation(request, candidat_id):
    print(candidat_id)
    data = request.data.copy()
    data['candidat'] = candidat_id
    serializer = SpecialisationSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
