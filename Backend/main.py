from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:5173' # this allows localhost:5173 to access FastAPI
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)