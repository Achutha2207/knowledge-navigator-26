# RAG Knowledge Assistant - Backend

FastAPI backend using Hugging Face Inference API for LLM responses.

## Quick Start

### 1. Get a Hugging Face API Token

1. Create a free account at [huggingface.co](https://huggingface.co)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token (read access is sufficient)

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your token:
```
HF_API_TOKEN=hf_your_actual_token_here
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Backend

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
Response: { "status": "backend_running" }
```

### Chat
```
POST /api/chat
Body: { "question": "Your question here" }
Response: { "status": "success", "question": "...", "answer": "..." }
```

### List Models
```
GET /api/models
Response: { "models": [...], "current": "..." }
```

## Deployment

### Render / Railway / Heroku

The `Procfile` is already configured:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set the `HF_API_TOKEN` environment variable in your deployment platform.

### Frontend Connection

The frontend expects the backend at `VITE_API_BASE_URL` (defaults to `http://localhost:8000`).

For production, set `VITE_API_BASE_URL` to your deployed backend URL.
