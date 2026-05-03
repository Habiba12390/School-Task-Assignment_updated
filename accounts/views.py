import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import User

def signup_page(request):
    return render(request, 'Sign_up.html')

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data             = json.loads(request.body)
        username         = data.get('username', '').strip()
        email            = data.get('email', '').strip().lower()
        password         = data.get('password', '').strip()
        confirm_password = data.get('confirm_password', '').strip()
        role             = data.get('role', '').strip()

        if not all([username, email, password, confirm_password, role]):
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match.'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists.'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=400)

        if role not in ['admin', 'teacher']:
            return JsonResponse({'error': 'Invalid role.'}, status=400)

        User.objects.create(username=username, email=email, password=password, role=role)
        return JsonResponse({'success': True, 'role': role})

    return JsonResponse({'error': 'Invalid method.'}, status=405)