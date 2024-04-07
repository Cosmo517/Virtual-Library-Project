from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# this allows for the React App (frontend) to access FastAPI 
# (the backend). It assumes the React App is running on
# local host on port 5173
origins = [
    'http://localhost:5173' 
]

# this just allows the origin thing from above
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)


# this acts as a way to post information
# that the frontend will be able to get
# @app.post("/books", response_model=)