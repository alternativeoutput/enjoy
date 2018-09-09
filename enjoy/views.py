import json
from django.shortcuts import render
from django.utils.safestring import mark_safe
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token


def index(request):
    return render(request, 'enjoy/index.html', {})


def room(request, room_name):
    return render(request, 'enjoy/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })


@login_required
def login_landing(request):
    csrf = get_token(request)
    return JsonResponse({'csrf': csrf})
