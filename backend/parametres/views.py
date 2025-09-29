from django.shortcuts import render, get_object_or_404, redirect
from .forms import ParametresForm

def creer_parametres(request):
    if request.method == 'POST':
        form = ParametresForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('liste_parametres')


    else:
        form = ParametresForm()

    return render(request, 'parametres/creer_parametres.html', {'form': form})



from django.shortcuts import render
from .models import Parametres

def liste_parametres(request):
    parametres = Parametres.objects.all()
    return render(request, 'parametres/liste_parametres.html', {'parametres': parametres})




def modifier_parametres(request, pk):
    parametre = get_object_or_404(Parametres, pk=pk)
    if request.method == 'POST':
        form = ParametresForm(request.POST, instance=parametre)
        if form.is_valid():
            form.save()
            return redirect('liste_parametres')
    else:
        form = ParametresForm(instance=parametre)
    return render(request, 'parametres/creer_parametres.html', {'form': form})

def supprimer_parametres(request, pk):
    parametre = get_object_or_404(Parametres, pk=pk)
    if request.method == 'POST':
        parametre.delete()
        return redirect('liste_parametres')
    return render(request, 'parametres/confirmer_suppression.html', {'parametre': parametre})


