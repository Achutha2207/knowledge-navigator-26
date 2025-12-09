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
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Initialize FastAPI app
app = FastAPI(
    title="RAG Knowledge Assistant API",
    description="Backend API for the Private RAG Knowledge Assistant",
    version="1.0.0"
)

# Configure CORS - allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"  # Allow all for flexibility
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class ChatHistoryItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatHistoryItem]] = []


class ChatResponse(BaseModel):
    reply: str


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
        model=OLLAMA_MODEL,
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


# Chat endpoint - main API for frontend
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to Ollama and get a response.
    Supports chat history for context.
    """
    try:
        logger.info(f"Chat request received: {request.message[:50]}...")
        
        # Build messages array for Ollama chat API
        messages = []
        
        # Add chat history
        for msg in request.history or []:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Call Ollama Chat API
        logger.info(f"Calling Ollama at {OLLAMA_BASE_URL}/api/chat with model {OLLAMA_MODEL}")
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False
            },
            timeout=120
        )
        response.raise_for_status()
        
        data = response.json()
        reply = data.get("message", {}).get("content", "").strip()
        
        if not reply:
            reply = "I received your message but couldn't generate a response."
        
        logger.info(f"Successfully generated response ({len(reply)} chars)")
        
        return ChatResponse(reply=reply)
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error to Ollama: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Please ensure Ollama is running on localhost:11434."
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
