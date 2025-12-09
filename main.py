"""
FastAPI Backend for RAG Knowledge Assistant
Connects to Ollama for LLM inference
"""

import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Environment variables
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL_NAME = os.getenv("MODEL_NAME", "mistral")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Initialize FastAPI app
app = FastAPI(
    title="RAG Knowledge Assistant API",
    description="Backend API for the Private RAG Knowledge Assistant",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str
    chat_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    status: str
    answer: str
    model: str
    tokens_used: int


class HealthResponse(BaseModel):
    status: str
    model: str
    ollama_url: str


class ModelsResponse(BaseModel):
    models: List[str]


# Health check endpoint
@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify backend is running"""
    logger.info("Health check requested")
    return HealthResponse(
        status="Backend is running",
        model=MODEL_NAME,
        ollama_url=OLLAMA_BASE_URL
    )


# Get available models from Ollama
@app.get("/api/models", response_model=ModelsResponse)
async def get_models():
    """Fetch available models from Ollama"""
    try:
        logger.info(f"Fetching models from Ollama at {OLLAMA_BASE_URL}")
        response = requests.get(
            f"{OLLAMA_BASE_URL}/api/tags",
            timeout=10
        )
        response.raise_for_status()
        
        data = response.json()
        models = [model["name"] for model in data.get("models", [])]
        
        logger.info(f"Successfully fetched {len(models)} models")
        return ModelsResponse(models=models)
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error to Ollama: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Please ensure Ollama is running."
        )
    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout connecting to Ollama: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail="Request to Ollama timed out."
        )
    except Exception as e:
        logger.error(f"Error fetching models: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch models: {str(e)}"
        )


# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a question to Ollama and get a response.
    Supports chat history for context.
    """
    try:
        logger.info(f"Chat request received: {request.question[:50]}...")
        
        # Build the prompt with chat history
        prompt = ""
        for msg in request.chat_history:
            if msg.role == "user":
                prompt += f"User: {msg.content}\n"
            elif msg.role == "assistant":
                prompt += f"Assistant: {msg.content}\n"
        
        prompt += f"User: {request.question}\nAssistant:"
        
        # Call Ollama API
        logger.info(f"Calling Ollama at {OLLAMA_BASE_URL}/api/generate")
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )
        response.raise_for_status()
        
        data = response.json()
        answer = data.get("response", "").strip()
        tokens_used = data.get("eval_count", 0) + data.get("prompt_eval_count", 0)
        
        logger.info(f"Successfully generated response with {tokens_used} tokens")
        
        return ChatResponse(
            status="success",
            answer=answer,
            model=MODEL_NAME,
            tokens_used=tokens_used
        )
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error to Ollama: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Please ensure Ollama is running."
        )
    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout connecting to Ollama: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail="Request to Ollama timed out. The model may be processing a complex query."
        )
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error from Ollama: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail=f"Ollama returned an error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
