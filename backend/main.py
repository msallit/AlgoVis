from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from algorithms.sort_manager import SortManager
from fastapi import Request
import os
import httpx
import json
from dotenv import load_dotenv
import openai
from fastapi.responses import StreamingResponse

if os.getenv("RENDER") is None:  # Only load .env locally
    from dotenv import load_dotenv
    load_dotenv()
print("Render API key (sanity):", os.getenv("OPENROUTER_API_KEY"), flush=True)


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
# Why using the httpx instead of the official openai library? 
  # I am using using OpenRouter, not OpenAI.com and OpenRouter is a proxy-like service that supports multiple models (like mistralai/mistral-7b-instruct) using the OpenAI API format — but it’s not officially supported by the OpenAI Python SDK.
@app.post("/ai-suggest")
async def ai_suggest(request: Request):
    data = await request.json()
    array = data.get("array", [])
    prompt = f"Given the array: {array}, suggest the best sorting algorithm and explain why in 30 words in simple terms."

    print("Received request with array:", array, flush=True)

    def stream():
        api_key=os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            yield "[Error]: Missing OpenRouter API key"
            return

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",  # Optional for local dev
            "X-Title": "AlgoVis"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "stream": True
        }

        try:
            with httpx.stream("POST", "https://openrouter.ai/api/v1/chat/completions",
                              headers=headers, json=payload, timeout=60) as r:
                for raw_line in r.iter_lines():
                    if not raw_line:
                        continue

                    # Decode safely
                    line = raw_line.decode("utf-8") if isinstance(raw_line, bytes) else raw_line
                    print("🔁 Got line:", line, flush=True)

                    if line.startswith("data:"):
                        content = line.replace("data: ", "")
                        if content.strip() == "[DONE]":
                            break
                        try:
                            chunk = json.loads(content)
                            delta = chunk["choices"][0]["delta"].get("content")
                            if delta:
                                print("Yielding chunk:", delta, flush=True)
                                yield delta
                        except Exception as e:
                            print("JSON ParseError:", str(e), flush=True)
                            yield f"\n[ParseError]: {str(e)}"
        except Exception as e:
            print("Request Error:", str(e), flush=True)
            yield f"\n[Error]: {str(e)}"

    return StreamingResponse(stream(), media_type="text/plain", headers={
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no"
    })