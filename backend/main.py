from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from algorithms.sort_manager import SortManager
from fastapi import Request
import os
from dotenv import load_dotenv
import openai
from fastapi.responses import StreamingResponse

load_dotenv()#Load environment variables from .env file

openai.api_key = os.getenv("OPENROUTER_API_KEY") # Set your OpenAI API key
openai.api_base = "https://openrouter.ai/api/v1"  # Required to override OpenAI base

app = FastAPI()
sort_manager = SortManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SortRequest(BaseModel):
    # This class defines the structure and logic for SortRequest
    array: List[int]

@app.post("/sort/{algorithm}")
def sort_array(algorithm: str, request: SortRequest):
        # Executes the sorting algorithm and tracks steps for visualization.
    return sort_manager.sort(algorithm, request.array)


#Accepts a POST request with an array
#Sends that array in a prompt to the LLM
#Returns the LLM’s explanation as a JSON object
@app.post("/ai-suggest")
async def ai_suggest(request: Request):
    data = await request.json()
    array = data.get("array", [])
    prompt = f"Given the array: {array}, suggest the best sorting algorithm and explain why in 40 words in simple terms."

    def stream():
        response = openai.ChatCompletion.create(
            model="mistralai/mistral-7b-instruct",  # free fast model
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=300,
            stream=True
        )
        for chunk in response:
            content = chunk["choices"][0].get("delta", {}).get("content")
            if content:
                yield content

    return StreamingResponse(stream(), media_type="text/plain")