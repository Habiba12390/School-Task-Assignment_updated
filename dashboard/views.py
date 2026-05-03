from django.shortcuts import render # type: ignore

def admin_dashboard(request):
    return render(request, 'dashboard/Admin_dashboard.html')

def teacher_dashboard(request):
    return render(request, 'dashboard/Teacher_dashboard.html')