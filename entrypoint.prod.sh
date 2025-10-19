#!/usr/bin/env bash

python3 manage.py collectstatic --noinput
python3 manage.py migrate --noinput
python3 gunicorn --workers 3 --bind 127.0.0.1:8000 sebayett.wsgi:application