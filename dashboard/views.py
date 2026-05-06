from django.shortcuts import render # type: ignore

def admin_dashboard(request):
    return render(request, 'Admin_dashboard.html')

def teacher_dashboard(request):
    return render(request, 'Teacher_dashboard.html')