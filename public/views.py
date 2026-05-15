from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import ContactMessage

def home(request):
    return render(request, 'home.html')

def contact(request):
    return render(request, 'contact.html')
    
def about(request):
    return render(request, 'About_us.html')

def submit_contact_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')
            
            if not all([name, email, message]):
                return JsonResponse({'success': False, 'error': 'All fields are required.'}, status=400)
                
            ContactMessage.objects.create(name=name, email=email, message=message)
            return JsonResponse({'success': True, 'message': 'Your message has been sent successfully! ✅'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Only POST requests are allowed.'}, status=405)