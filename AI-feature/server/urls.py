
from django.urls import path
from.views  import generate_code

urlpatterns = [
    path('generate/', generate_code.as_view(), name='generate_code'),
]