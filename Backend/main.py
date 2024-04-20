from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
import models
import hashlib #For doing hashing of passwords
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import delete, desc
from JWT_handler import signJWT, decodeJWT

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# this allows for the React App (frontend) to access FastAPI 
# (the backend). It assumes the React App is running on
# local host on port 5173
origins = [
    '127.0.0.1:5173' 
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
    
class BooksModel(BaseModel):
    isbn: str
    
class UserBase(BaseModel):
    username: str
    password: str
    administrator: int
    
class UserRegistrationBase(BaseModel):
    username: str
    password: str
    checkpass: str
    administrator: int

class LoginRequest(BaseModel):
    username: str
    password: str
    
class JWT_token(BaseModel):
    token: str
    
class SearchRequest(BaseModel):
    search: str
    searchType: str
    AZ: bool
    ZA: bool
    yearBefore: int
    yearAfter: int
    

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

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
@app.post("/single_book/", status_code=status.HTTP_200_OK)
async def get_book(book: BooksModel, db: db_dependency):
    book_info = db.query(models.Books).filter(models.Books.isbn == book.isbn).first()
    if book_info is None:
        HTTPException(status_code=404, detail='Book not found') 
    return book_info

# TODO: the get_book above only searched for a single book, we need one for all books
@app.get('/books/', response_model=List[BooksBase])
async def read_books(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.title).offset(skip).limit(limit).all()
    return books

# Manually filtered books from the users search
@app.post('/filter/', status_code=status.HTTP_200_OK)
async def filter_books(filter: SearchRequest, db: db_dependency):
    search_info = filter.model_dump()
    
    search = search_info['search']
    searchType = search_info['searchType']
    AZ = search_info['AZ']
    ZA = search_info['ZA']
    yearBefore = search_info['yearBefore']
    yearAfter = search_info['yearAfter']
    print(yearBefore)
    
    
    filtered_books = {}
    if searchType == 'ISBN':
        if ZA:
            filtered_books = db.query(models.Books).filter(models.Books.isbn.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.title.desc()).all()
        else:
            filtered_books = db.query(models.Books).filter(models.Books.isbn.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.title).all()

    elif searchType == 'Title':
        if ZA:
            filtered_books = db.query(models.Books).filter(models.Books.title.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.title.desc()).all()
        else:
            filtered_books = db.query(models.Books).filter(models.Books.title.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.title).all()
    
    elif searchType == 'Author':
        if ZA:
            filtered_books = db.query(models.Books).filter(models.Books.author.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.author.desc()).all()
        else:
                        filtered_books = db.query(models.Books).filter(models.Books.author.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.author).all()
    
    elif searchType == 'Genre':
        if ZA:
            filtered_books = db.query(models.Books).filter(models.Books.category.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.category.desc()).all()
        else:
            filtered_books = db.query(models.Books).filter(models.Books.category.like("%" + search + "%"), models.Books.published_year.between(yearBefore, yearAfter)).order_by(models.Books.category).all()
    
    return filtered_books


# TODO: return sorted books
@app.get('/books by years/', response_model=List[BooksModel])
async def read_books_by_year(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.published_year).order_by(models.Books.title).offset(skip).limit(limit)
    return books

@app.get('/books by title/', response_model=List[BooksModel])
async def read_books_by_title(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.title).order_by(models.Books.author).offset(skip).limit(limit)
    return books

@app.get('/books by author/', response_model=List[BooksModel])
async def read_books_by_title(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.author).order_by(models.Books.title).offset(skip).limit(limit)
    return books

@app.get('/books by isbn/', response_model=List[BooksModel])
async def read_books_by_title(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.isbn).offset(skip).limit(limit)
    return books

@app.get('/books by publisher/', response_model=List[BooksModel])
async def read_books_by_title(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.publisher).order_by(models.Books.title).offset(skip).limit(limit)
    return books

@app.get('/books by category/', response_model=List[BooksModel])
async def read_books_by_title(db: db_dependency, skip: int = 0, limit: int = 100):
    books = db.query(models.Books).order_by(models.Books.category).order_by(models.Books.title).offset(skip).limit(limit)
    return books

@app.post('/delete_book/', status_code=status.HTTP_200_OK)
async def delete_book(book: BooksModel, db: db_dependency):
    book_data = db.query(models.Books).filter(models.Books.isbn == book.isbn)
    if book_data.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ISBN: {book.isbn} does not exist")
    
    book_data.delete(synchronize_session=False)
    db.commit()

@app.get("/funfacts largest book/", status_code=status.HTTP_201_CREATED)
async def most_pages(db: db_dependency):
    max = db.query(models.Books).order_by(models.Books.page_count.desc()).first()
    return max

@app.get("/funfacts total amount of books/", status_code=status.HTTP_201_CREATED)
async def total_books(db: db_dependency):
    books = db.query(models.Books).count()
    return books

# TODO: Fun functions of total pages
# @app.get("/funfacts total amount of pages/", status_code=status.HTTP_201_CREATED)
# async def total_pages(db: db_dependency):
#     pages = select([func.sum(models.Books.page_count)])
#     return pages

# TODO: Fun functions of top 5 rated books

# this will add users to the database, thus should be used by the
# frontend to create users (register accounts)
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserRegistrationBase, db: db_dependency):
    holdUser = user.model_dump()
    del holdUser['checkpass']
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
@app.post("/login/")
async def login(login: LoginRequest, db: db_dependency):
    if login.username == '':
        return {}
    user = db.query(models.User).filter(models.User.username == login.username).first()
    if user and isPasswordCorrect(user.password, login.password):
        return signJWT(user.username, user.administrator)
    else:
        return {}

@app.post("/token/")
async def validate_jwt(token: JWT_token, db: db_dependency):
    data = decodeJWT(token.token)
    print(data)
    return data