from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Experience
from .serializers import ExperienceSerializer

@api_view(['POST'])
def create_experience(request, candidat_id):
    data = request.data.copy()
    data['candidat'] = candidat_id
    serializer = ExperienceSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_experiences_by_candidat(request, candidat_id):
    experiences = Experience.objects.filter(candidat_id=candidat_id)
    serializer = ExperienceSerializer(experiences, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_experience(request, experience_id):
    try:
        experience = Experience.objects.get(id=experience_id)
    except Experience.DoesNotExist:
        return Response({"error": "Expérience non trouvée"}, status=404)

    serializer = ExperienceSerializer(experience, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_experience(request, experience_id):
    try:
        experience = Experience.objects.get(id=experience_id)
        experience.delete()
        return Response({'message': 'Expérience supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except Experience.DoesNotExist:
        return Response({'error': 'Expérience non trouvée'}, status=status.HTTP_404_NOT_FOUND)

