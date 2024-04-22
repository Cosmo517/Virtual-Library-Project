from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
import models
import hashlib #For doing hashing of passwords
from database import engine, SessionLocal
from sqlalchemy.orm import Session, sessionmaker
from JWT_handler import signJWT, decodeJWT
import configparser
import os

# Set FastAPI up
app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# this allows for the React App (frontend) to access FastAPI 
# (the backend). It assumes the React App is running on
# local host on port 5173
origins = [
    '127.0.0.1:5173' 
]

# this just allows the origin thing from above
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# -- Below is all the bases or models for different requests -- #
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
    ZA: bool
    yearBefore: int
    yearAfter: int

class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str
    checkNewPass: str
    token: str

# -- End of the different models -- #


# create the database instance
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# the database dependency
db_dependency = Annotated[Session, Depends(get_db)]

def stringToHash(stringPassword: str):
    """Converts a string into a hashed value

    Args:
        stringPassword (str): The plaintext password to hash

    Returns:
        str: The hashed password 
    """
    h = hashlib.new("SHA256")
    h.update(stringPassword.encode())
    password_hash = h.hexdigest()
    return password_hash

# this checks the user's hash value password to be check
# aginst what the user inputed to login
def isPasswordCorrect(correct: str, check: str):
    """Checks to see if the users password they entered
    is correct by comparing it to the one in the database

    Args:
        correct (str): Hashed password from the database
        check (str): Password the user entered

    Returns:
        bool: True if the passwords match, false otherwise 
    """
    check = stringToHash(check)
    if (correct == check):
        return True
    else:
        return False

# Open the config file up
config_file = None
if (os.path.isfile('dev.cfg')):
    config_file = 'dev.cfg'
else:
    config_file = 'settings.cfg'

# read from the configuration file
config = configparser.ConfigParser()
config.read(config_file)

# grab the admin's user and password
admin_user = config['LIBRARY']['user']
admin_pass = config['LIBRARY']['password']

def createAdminAccount():
    """This is used to create an admin account if it doesnt already exist by running on startup
    """
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    # create the base for the admin_account
    admin_account = UserBase(username=admin_user, password=admin_user, administrator=1)
    details = admin_account.model_dump()
    # check to see if the account already exists
    admin_username = db.query(models.User).filter(models.User.username == details['username']).first()
    # if the account doesnt exist, create it
    if not admin_username:
        details["password"] = stringToHash(details["password"])
        db_user = models.User(**details)
        db.add(db_user)
        db.commit()

createAdminAccount()

# -- The functions below are for the database queries -- #

@app.post("/books/", status_code=status.HTTP_201_CREATED)
async def create_book(book: BooksBase, db: db_dependency):
    """This will allow for creation of books and inserting them into the database. The 
    frontend will use this function

    Args:
        book (BooksBase): The information that the dictionary
        should be passing from the frontend
        db (db_dependency): the database

    Returns:
        dict: A success or failed prompt
    """
    db_book = models.Books(**book.model_dump())
    # search for the book
    book_info = db.query(models.Books).filter(models.Books.isbn == book.isbn).first()
    # create the book if it doesnt exist and return the proper response
    if not book_info:            
        db.add(db_book)
        db.commit()
        return {'response' : 'success'}
    else:
        return {'response' : 'book already exists'}

# this will get a book (or multiple) from the database
# can be used by the frontend to get books.
@app.post("/single_book/", status_code=status.HTTP_200_OK)
async def get_book(book: BooksModel, db: db_dependency):
    """This function will gett a single book from the database

    Args:
        book (BooksModel): A dictionary containing information about the book
        db (db_dependency): the database

    Returns:
        dict: Info about the book that was found, if at all 
    """
    book_info = db.query(models.Books).filter(models.Books.isbn == book.isbn).first()
    if book_info is None:
        HTTPException(status_code=404, detail='Book not found') 
    return book_info

# TODO: the get_book above only searched for a single book, we need one for all books
@app.get('/books/', response_model=List[BooksBase])
async def read_books(db: db_dependency, skip: int = 0, limit: int = 100):
    """The following function will grab books between skip and the 
    limit specified (0 to 100 by default)

    Args:
        db (db_dependency): The database
        skip (int, optional): The amount of entries to skip. Defaults to 0.
        limit (int, optional): The amount of books to return. Defaults to 100.

    Returns:
        dict: All the books that were found
    """
    books = db.query(models.Books).order_by(models.Books.title).offset(skip).limit(limit).all()
    return books

# Manually filtered books from the users search
@app.post('/filter/', status_code=status.HTTP_200_OK)
async def filter_books(filter: SearchRequest, db: db_dependency):
    """This function filters the books based on the SearchRequest from the user.

    Args:
        filter (SearchRequest): The information from the frontend about the users search
        db (db_dependency): The database

    Returns:
        dict: The filtered list of books
    """
    search_info = filter.model_dump()
    
    # grab all the information from the SearchRequest
    search = search_info['search']
    searchType = search_info['searchType']
    ZA = search_info['ZA']
    yearBefore = search_info['yearBefore']
    yearAfter = search_info['yearAfter']
    print(yearBefore)
    
    # Filter the books based on the searchType, then on the alphabet order
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

@app.post('/delete_book/', status_code=status.HTTP_200_OK)
async def delete_book(book: BooksModel, db: db_dependency):
    """The following function deletes a book from the database.
    It takes in data from the frontend from an administrator

    Args:
        book (BooksModel): The model for the information that should be received
        from the frontend
        db (db_dependency): The database

    Raises:
        HTTPException: An HTML exception if a book isnt found
    """
    book_data = db.query(models.Books).filter(models.Books.isbn == book.isbn)
    if book_data.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ISBN: {book.isbn} does not exist")
    
    book_data.delete(synchronize_session=False)
    db.commit()

@app.get("/funfacts largest book/", status_code=status.HTTP_201_CREATED)
async def most_pages(db: db_dependency):
    """This function returns the largest book within the database

    Args:
        db (db_dependency): The databsae

    Returns:
        dict: The book with the maximum number of pages
    """
    max = db.query(models.Books).order_by(models.Books.page_count.desc()).first()
    return max

@app.get("/funfacts total amount of books/", status_code=status.HTTP_201_CREATED)
async def total_books(db: db_dependency):
    """This function will return the total amount of books in the library

    Args:
        db (db_dependency): The database

    Returns:
        dict: A key value pair where the value is the total amount of books in the library
    """
    books = db.query(models.Books).count()
    return {'books' : books}

@app.get("/funfacts total amount of pages/", status_code=status.HTTP_201_CREATED)
async def total_pages(db: db_dependency):
    """The total amount of pages within the library

    Args:
        db (db_dependency): The database

    Returns:
        dict: A key value pair where the value is the total amount of pages in the library
    """
    pages = db.query(func.sum(models.Books.page_count)).scalar()
    return {'pages' : pages}


# this will add users to the database, thus should be used by the
# frontend to create users (register accounts)
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserRegistrationBase, db: db_dependency):
    """This function creates a user and inserts their information into the database.

    Args:
        user (UserRegistrationBase): The user information from the frontend
        db (db_dependency): The database

    Returns:
        dict: Either a success response or Username taken response
    """
    holdUser = user.model_dump()
    # delete the checkpass statement as we dont need it
    del holdUser['checkpass']
    # search through the users table
    username = db.query(models.User).filter(models.User.username == holdUser["username"]).first()
    if username:
        return {'response' : 'Username taken'}
    else:
        holdUser["password"] = stringToHash(holdUser["password"])
        db_user = models.User(**holdUser)
        db.add(db_user)
        db.commit()
        return {'response' : 'Success'}

# this filters out the user based on username then get the input from the user
# constiting of their current password, and their new password twice
#  then checks and either changes the password or gives error
@app.post("/passwords/", status_code=status.HTTP_201_CREATED)
async def change_password(request: ChangePasswordRequest, db: db_dependency):
    """This function changes a users password in the database

    Args:
        request (ChangePasswordRequest): The request from the frontend to 
        change the password
        db (db_dependency): The database

    Returns:
        dict: A response dict indicating "Accepted", "Invalid Password", "Expired"
    """
    request_info = request.model_dump()
    # delete the checkNewPass data as its no longer needed
    del request_info['checkNewPass']
    
    old_password = request_info['oldPassword']
    new_password = request_info['newPassword']
    
    # decode the JWT token
    token_info = decodeJWT(request_info['token'])
    if token_info:
        user = token_info['username']
        
        # find the user if they exist
        username = db.query(models.User).filter(models.User.username == user).first()
        # if they exist, and the entered password is the same as the one in the database
        if username and isPasswordCorrect(username.password, old_password):
            # hash the new password and the update the database
            new_pass = stringToHash(new_password)
            username.password = new_pass
            db.commit()
            return {'response': 'Accepted'}
        else:
            return {'response': 'Invalid Password'}
        
    else:
        return {'response': 'Expired'}

# This filter out the user from the database and takes and input for a password from the user
# It then check if the user is in table and if the inputted password is correct
@app.post("/login/")
async def login(login: LoginRequest, db: db_dependency):
    """This function "logs" a user in by assigning them a JWT token
    that will be stored in their browser.

    Args:
        login (LoginRequest): The login information from the frontend
        db (db_dependency): The database

    Returns:
        dict: Either an empty dict or a dictionary containing a JWT token
    """
    if login.username == '':
        return {}
    user = db.query(models.User).filter(models.User.username == login.username).first()
    if user and isPasswordCorrect(user.password, login.password):
        return signJWT(user.username, user.administrator)
    else:
        return {}

@app.post("/token/")
async def validate_jwt(token: JWT_token, db: db_dependency):
    """This validates and decodes the JWT that the frontend sends

    Args:
        token (JWT_token): The JWT token to decode
        db (db_dependency): The database

    Returns:
        dict: Either an empty dict or a dict with information about the user
    """
    data = decodeJWT(token.token)
    return data
