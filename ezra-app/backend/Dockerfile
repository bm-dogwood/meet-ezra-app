FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create staticfiles directory and collect static files
RUN mkdir -p staticfiles && python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --timeout 300 --workers 4 --worker-class gthread --threads 2 --max-requests 1000 --max-requests-jitter 50"]
