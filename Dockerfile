# Use an official Python runtime as a parent image
FROM python:3.13-slim as builder

# Create the app directoy
RUN mkdir /app

# Set the working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt


# Stage2: Procduction stage
FROM python:3.13-slim

RUN useradd -m -r sebayett && \
	mkdir /app && \
	chown -R sebayett /app



# Copy the Python dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Set the wroking directory
WORKDIR /app

# Copy application code
COPY --chown=sebayett:sebayett . .

# Set environment variables to optimize Python performance
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Swtich to the non-root user
USER sebayett

# Expose the port the app runs on
EXPOSE 8000

# Make entry file executable
RUN chmod +x ./entrypoint.prod.sh

# Run the application
CMD ["python3", "manage.py", "runserver"]
# CMD ["gunicorn", "sebayett.wsgi:application", "--bind", "127.0.0.1:8000"]
# CMD ["/app/entrypoint.prod.sh"]
