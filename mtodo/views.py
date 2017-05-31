from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.core import serializers
from .models import Todo

@login_required
def index(request):
    return render(request, 'mtodo/index.html')

@login_required
def todo_list(request):
    todos = serializers.serialize('json', Todo.objects.order_by('-pk'))
    return HttpResponse(todos, content_type='application/json')

@login_required
def add_todo(request):
    todo = Todo.objects.create(todo_text=request.POST['todo_text'])
    todo.save()
    return HttpResponse()

@login_required
def change_todo(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.todo_text = todo_text=request.POST['todo_text']
    todo.save()
    return HttpResponse()

@login_required
def delete_todo(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.delete()
    return HttpResponse()

@login_required
def toggle_completed(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.completed = not todo.completed
    todo.save()
    return HttpResponse()

@login_required
def toggle_all(request):
    total_todos = len(Todo.objects.all())
    # Get number of completed todos
    completed_todos = 0
    for todo in Todo.objects.all():
        if todo.completed == True:
            completed_todos += 1
    # Toggle all todos
    for todo in Todo.objects.all():
        if completed_todos == total_todos:
            todo.completed = False
            todo.save()
        else:
            todo.completed = True
            todo.save()
    return HttpResponse()
