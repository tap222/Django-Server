# Use ubuntu 24.04 as the base image
FROM python:3.13-slim

RUN apt-get update && apt-get install -y \
	build-essential \
	postgresql-client \
	libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000


CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]