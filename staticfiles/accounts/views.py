import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data     = json.loads(request.body)
        name     = data.get('name', '').strip()
        email    = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        role     = data.get('role', '').strip()

        if not all([name, email, password, role]):
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists.'}, status=400)

        User.objects.create(name=name, email=email, password=password, role=role)
        return JsonResponse({'success': True, 'role': role})

    return JsonResponse({'error': 'Invalid method.'}, status=405)