from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_book(mock_db_session):
    # Test the create_book endpoint
    response = client.post("/books/", json={"isbn": "1234567890", "title": "Test Book", "author": "Test Author", "publisher": "Test Publisher", "page_count": 100, "published_year": 2022, "category": "Test Category"})
    assert response.status_code == 201
    # Add more assertions as needed

def test_get_book(mock_db_session):
    # Test the get_book endpoint
    response = client.post("/single_book/", json={"isbn": "1234567890"})
    assert response.status_code == 200
    # Add more assertions as needed

def test_remove_book(mock_db_session):
    # Test the remove_book endpoint
    response = client.post("/delete_book/", json={"isbn": "1234567890"})
    assert response.status_code == 200
    # Add more assertions as needed