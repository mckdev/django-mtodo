from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^mtodo/', include('mtodo.urls')),
    url(r'^mtodo/admin/', admin.site.urls),

    url(r'^accounts/login/$', auth_views.login, name='login'),
]
