# RAG Knowledge Assistant - Backend

FastAPI backend for the Private RAG Knowledge Assistant that connects to Ollama for LLM inference.

## Prerequisites

- Python 3.9+
- [Ollama](https://ollama.ai/) installed and running
- A model pulled in Ollama (e.g., `ollama pull mistral`)

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example environment file and modify as needed:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `OLLAMA_BASE_URL`: URL where Ollama is running (default: http://localhost:11434)
- `MODEL_NAME`: The Ollama model to use (default: mistral)
- `ENVIRONMENT`: development, staging, or production

### 4. Start Ollama

Make sure Ollama is running:

```bash
ollama serve
```

Pull the model if you haven't already:

```bash
ollama pull mistral
```

### 5. Run the Backend

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```
GET /
```

Returns backend status, model name, and Ollama URL.

**Response:**
```json
{
  "status": "Backend is running",
  "model": "mistral",
  "ollama_url": "http://localhost:11434"
}
```

### List Available Models

```
GET /api/models
```

Returns list of models available in Ollama.

**Response:**
```json
{
  "models": ["mistral:latest", "llama2:latest"]
}
```

### Chat

```
POST /api/chat
```

Send a question and receive an AI-generated response.

**Request Body:**
```json
{
  "question": "What is machine learning?",
  "chat_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help you?"}
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "answer": "Machine learning is a subset of artificial intelligence...",
  "model": "mistral",
  "tokens_used": 150
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `500`: Internal server error
- `502`: Bad gateway (Ollama error)
- `503`: Service unavailable (Cannot connect to Ollama)
- `504`: Gateway timeout (Ollama request timed out)

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Production Deployment

The `Procfile` is configured for deployment to platforms like Heroku or Railway:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Project Structure

```
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (git-ignored)
├── .env.example         # Example environment variables
├── Procfile            # Production deployment config
└── backend-README.md   # This file
```

## Connecting Frontend

Update your React frontend to point to this backend:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question, chat_history })
});
```

## License

MIT
