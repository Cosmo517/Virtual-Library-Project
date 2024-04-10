from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import models
import hashlib #For doing hashing of passwords
from database import engine, SessionLocal
from sqlalchemy.orm import Session
import logging

app = FastAPI()

origins = [
    '127.0.0.1:49462' 
]

# # this just allows the origin thing from above
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class BooksBase(BaseModel):
    isbn: str
    title: str
    author: str
    publisher: str
    page_count: int
    published_year: int
    category: str
    
class BooksModel(BooksBase):
    isbn: str
    
    class Config:
        from_attributes = True
    
class UserBase(BaseModel):
    username: str
    password: str
    administrator: int
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        


db_dependency = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine)

# this allows for a string to be taken in and be converited into a hash value
# it will then return a hash value 
def stringToHash(stringPassword):
    h = hashlib.new("SHA256")
    h.update(stringPassword.encode())
    password_hash = h.hexdigest()
    return password_hash

# this checks the user's hash value password to be check
# aginst what the user inputed to login
def isPasswordCorrect(correct,check):
    check = stringToHash(check)
    if (correct == check):
        return True
    else:
        return False


# this allows for the React App (frontend) to access FastAPI 
# (the backend). It assumes the React App is running on
# local host on port 5173


#! Below here (should I think) be all the database queries

# this will add books to the database, thus should be used
# by the frontend to add books
@app.post("/books/", status_code=status.HTTP_201_CREATED)
async def create_book(book: BooksBase, db: db_dependency):
    db_book = models.Books(**book.model_dump())
    db.add(db_book)
    db.commit()

# this will get a book (or multiple) from the database
# can be used by the frontend to get books.
@app.get("/books/{isbn}", status_code=status.HTTP_200_OK)
async def get_book(book_isbn: str, db: db_dependency):
    book = db.query(models.Books).filter(models.Books.isbn == book_isbn).first()
    if book is None:
        HTTPException(status_code=404, detail='Book not found') 
    return book


# TODO: the get_book above only searched for a single book, we need one for all books
@app.get('/books/', response_model=List[BooksModel])
async def read_books(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).offset(skip).limit(limit).all()
    return books

# TODO: Create a DELETE book function


# this will add users to the database, thus should be used by the
# frontend to create users (register accounts)
# TODO: Check whether username is already taken
# TODO: Make sure to hash user password before storing
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    holdUser = user.model_dump()
    username = db.query(models.User).filter(models.User.username == holdUser["username"]).first()
    if username:
        raise HTTPException(status_code=409, detail='User already exists')
    else:
        holdUser["password"] = stringToHash(holdUser["password"])
        db_user = models.User(**holdUser)
        db.add(db_user)
        db.commit()


# this filters the users to grab a specific row from the database
# based on username to validate user information 
# (i.e. username/password) to login
@app.get("/users/{username}", status_code=status.HTTP_200_OK)
async def read_user(user: str, db: db_dependency):
    username = db.query(models.User).filter(models.User.username == user).first()
    if username is None:
        raise HTTPException(status_code=404, detail='User not found')
    return username


# this filters out the user based on username then get the input from the user
# constiting of their current password, and their new password twice
#  then checks and either changes the password or gives error
@app.post("/passwords/", status_code=status.HTTP_201_CREATED)
async def change_password(currentpassword:str, newpassword:str, passwordcheck:str, user:str, db: db_dependency):
    username = db.query(models.User).filter(models.User.username == user).first()
    if username and isPasswordCorrect(username.password,currentpassword):
        newpassword = stringToHash(newpassword)
        if isPasswordCorrect(newpassword,passwordcheck):
            username.password = newpassword
            db.commit()
        else:
            raise HTTPException(status_code=401, detail='Invalid Password')
    else:
        raise HTTPException(status_code=401, detail='Invalid Username or Password')

# This filter out the user from the database and takes and input for a password from the user
# It then check if the user is in table and if the inputted password is correct
@app.get("/password/", status_code=status.HTTP_201_CREATED)
async def login(passwordinput:str, user:str, db: db_dependency):
    username = db.query(models.User).filter(models.User.username == user).first()
    if username and isPasswordCorrect(username.password,passwordinput):
        raise HTTPException(status_code=status.HTTP_200_OK, detail='Login successful')
    else:
        raise HTTPException(status_code=401, detail='Invalid Username or Password')