from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = 'users'
    username = Column(String(25), primary_key=True, index=True)
    password = Column(String(512), nullable=False)
    administrator = Column(Integer, nullable=False)
    
class Books(Base):
    __tablename__ = 'books'
    isbn = Column(String(14), primary_key=True, index=True)
    title = Column(String(50), nullable=False)
    author = Column(String(50), nullable=False)
    publisher = Column(String(50), nullable=False)
    page_count = Column(Integer, nullable=False)
    published_year = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)