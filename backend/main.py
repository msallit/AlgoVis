from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from algorithms.sort_manager import SortManager

app = FastAPI()
sort_manager = SortManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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