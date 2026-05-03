from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from .models import Task
from .serializers import TaskSerializer
from django.shortcuts import render # type: ignore

@api_view(['GET', 'POST'])
def task_list(request):

    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response( serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET', 'PUT'])
def task_detail(request, task_id):

    try:
        task = Task.objects.get(task_ID=task_id)
    except Task.DoesNotExist:
        return Response(
            {'error': 'Task not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(
            task, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

def add_task_page(request):
    return render(request, 'tasks/Add_Task.html')

def edit_task_page(request):
    return render(request, 'tasks/Edit_Task.html')

def completed_tasks_page(request):
    return render(request, 'tasks/Completed_tasks.html')

def task_details_page(request, task_id):
    return render(request, 'tasks/Task_details.html')