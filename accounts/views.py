import json
from django.http import JsonResponse # type: ignore
from django.shortcuts import render # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from .models import User

def signup_page(request):
    return render(request, 'Sign_up.html')

def login_page(request):
    return render(request, 'login.html')

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

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data     = json.loads(request.body)
        email    = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required.'}, status=400)

        try:
            user = User.objects.get(email=email, password=password)

            # Store user info in Django session (server-side)
            request.session['user_id']    = user.id
            request.session['user_role']  = user.role
            request.session['user_email'] = user.email
            request.session['user_name']  = user.username

            # Determine redirect URL based on role
            if user.role == 'admin':
                redirect_url = '/api/dashboard/admin-dashboard/'
            else:
                redirect_url = '/api/dashboard/teacher-dashboard/'

            return JsonResponse({
                'success': True,
                'role': user.role,
                'name': user.username,
                'redirect_url': redirect_url,
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid email or password.'}, status=400)

    return JsonResponse({'error': 'Invalid method.'}, status=405)