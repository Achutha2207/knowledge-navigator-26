"""
FastAPI Backend for RAG Knowledge Assistant
Uses Hugging Face Inference API for LLM responses
"""

import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="RAG Knowledge Assistant API",
    description="Backend API using Hugging Face Inference for chat responses",
    version="1.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face configuration
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"
HF_API_TOKEN = os.getenv("HF_API_TOKEN")


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    status: str
    question: str
    answer: str


class ErrorResponse(BaseModel):
    status: str
    message: str


@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {"status": "backend_running"}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Process a chat message using Hugging Face Inference API
    """
    logger.info(f"Received question: {request.question[:100]}...")
    
    # Check for HF API token
    if not HF_API_TOKEN:
        logger.error("HF_API_TOKEN not configured")
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": "HF_API_TOKEN not configured on server"}
        )
    
    try:
        # Format the prompt for Mistral Instruct
        prompt = f"<s>[INST] {request.question} [/INST]"
        
        headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 512,
                "temperature": 0.7,
                "top_p": 0.95,
                "do_sample": True,
                "return_full_text": False
            }
        }
        
        logger.info("Calling Hugging Face Inference API...")
        response = requests.post(
            HF_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 503:
            # Model is loading
            error_data = response.json()
            estimated_time = error_data.get("estimated_time", 20)
            logger.warning(f"Model is loading, estimated time: {estimated_time}s")
            raise HTTPException(
                status_code=503,
                detail={
                    "status": "error",
                    "message": f"Model is loading, please try again in {int(estimated_time)} seconds"
                }
            )
        
        if response.status_code != 200:
            logger.error(f"HF API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=502,
                detail={
                    "status": "error",
                    "message": f"Hugging Face API error: {response.status_code}"
                }
            )
        
        result = response.json()
        
        # Extract the generated text
        if isinstance(result, list) and len(result) > 0:
            answer = result[0].get("generated_text", "").strip()
        else:
            answer = str(result)
        
        if not answer:
            answer = "I couldn't generate a response. Please try again."
        
        logger.info(f"Generated answer: {answer[:100]}...")
        
        return {
            "status": "success",
            "question": request.question,
            "answer": answer
        }
        
    except requests.exceptions.Timeout:
        logger.error("Hugging Face API request timed out")
        raise HTTPException(
            status_code=504,
            detail={"status": "error", "message": "Request timed out, please try again"}
        )
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Hugging Face API")
        raise HTTPException(
            status_code=503,
            detail={"status": "error", "message": "Failed to connect to Hugging Face API"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": str(e)}
        )


@app.get("/api/models")
async def list_models():
    """List available models"""
    return {
        "models": ["mistralai/Mistral-7B-Instruct-v0.1"],
        "current": "mistralai/Mistral-7B-Instruct-v0.1"
    }
