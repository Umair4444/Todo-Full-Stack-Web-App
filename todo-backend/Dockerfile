FROM python:3.11-slim

WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port (Hugging Face Spaces will set the PORT environment variable)
EXPOSE 8000

# Run the application
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]