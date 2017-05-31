from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^todo_list/$', views.todo_list, name='todo_list'),
    url(r'^(?P<pk>[0-9]+)/complete/$', views.toggle_completed, name='toggle_completed'),
    url(r'^(?P<pk>[0-9]+)/delete/$', views.delete_todo, name='delete_todo'),
    url(r'^(?P<pk>[0-9]+)/change/$', views.change_todo, name='change_todo'),
    url(r'^add_todo/', views.add_todo, name='add_todo'),
    url(r'^toggle_all/', views.toggle_all, name='toggle_all'),
]