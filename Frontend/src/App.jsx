import React, {useState, useEffect} from 'react'
import api from './api'

const App = () => {
  const [books, setBooks] = useState([]);
  // this will be a "form" for books
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    page_count: 0,
    published_year: 0,
    category: ''
  });

  const fetchBooks = async() => {
    const response = await api.get('/books/');
    return response;
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    formData.page_count = parseInt(formData.page_count);
    formData.publish_year = parseInt(formData.publish_year);
    await api.post('/books/', formData)
    fetchBooks();
    setFormData({
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      page_count: 0,
      published_year: 0,
      category: ''
    });
  };

  return (
    <div>
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            Virtual Library
          </a>
        </div>
      </nav>

      <div className='container'>
        <form onSubmit={handleFormSubmit}>
          <div className='mb-1 mt-5'>
            <label htmlFor='isbn' className='form-label'>
              ISBN
            </label>
            <input type='text' className='form-control' id='isbn' name='isbn' onChange={handleInputChange} value={formData.isbn}/>
          </div>

          <div className='mb-1'>
            <label htmlFor='title' className='form-label'>
              Title
            </label>
            <input type='text' className='form-control' id='title' name='title' onChange={handleInputChange} value={formData.title}/>
          </div>

          <div className='mb-1'>
            <label htmlFor='author' className='form-label'>
              Author
            </label>
            <input type='text' className='form-control' id='author' name='author' onChange={handleInputChange} value={formData.author}/>
          </div>

          <div className='mb-1'>
            <label htmlFor='publisher' className='form-label'>
              Publisher
            </label>
            <input type='text' className='form-control' id='publisher' name='publisher' onChange={handleInputChange} value={formData.publisher}/>
          </div>

          <div className='mb-1'>
            <label htmlFor='page_count' className='form-label'>
              Page Count
            </label>
            <input type='number' className='form-control' id='page_count' name='page_count' onChange={handleInputChange} value={formData.page_count}/>
          </div>

          <div className='mb-1'>
            <label htmlFor='publish_year' className='form-label'>
              Year Published
            </label>
            <input type='number' className='form-control' id='published_year' name='published_year' onChange={handleInputChange} value={formData.published_year}/>
          </div>

          <div className='mb-1'>
            <label htmlFor='category' className='form-label'>
              Category/Genre
            </label>
            <input type='text' className='form-control' id='category' name='category' onChange={handleInputChange} value={formData.category}/>
          </div>

          <button type='submit' className='btn btn-primary'>
          Add Book
        </button>
        </form>
      </div>

    </div>
  )
}

export default App
