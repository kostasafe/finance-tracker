FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application and prebuilt frontend
COPY . .

ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=sqlite:///./dev.db

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
