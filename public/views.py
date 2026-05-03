from django.shortcuts import render # type: ignore

def home(request):
    return render(request, 'Home.html')

def contact(request):
    return render(request, 'Contact.html')