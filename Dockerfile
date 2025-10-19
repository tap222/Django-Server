# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*


# Set the working directory in the container
WORKDIR /app

# Copy requirements file
COPY requirements.txt ./



RUN apt update && apt install -y python3-pip



# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt


# Copy the current directory contents into the container at /app
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Expose PostgreSQL port
EXPOSE 5432

# Run the application
CMD ["python3", "manage.py", "runserver"]
# CMD ["gunicorn", "sebayett.wsgi:application", "--bind", "127.0.0.1:8000"]
