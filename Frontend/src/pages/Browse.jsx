import { Navbar } from "../Components/Navbar";
import { BookList } from "../Components/BookList";
import { useState, useEffect } from "react";
import api from "../api";
import '../CSS/browse.css'


export const Browse = () => {

    
    const [isAdmin, setIsAdmin] = useState(false)

    const checkUserRole = async () =>
    {
        try 
        {
            if (Cookies.get('token') === undefined)
            {
                setIsAdmin(false)
            }
            else
            {
                const token = await api.post("/token/", { 'token' : Cookies.get('token') })
                if (token.data != null && token.data.administrator == 1)
                {
                    setIsAdmin(true)
                }
                else
                {
                    setIsAdmin(false)
                }
            }
        }
        catch (err)
        {
            setIsAdmin(false)
        }
    }

    useEffect(() => {
        checkUserRole();
    }, []);
    
    const [books, setBooks] = useState([])

    const [formData, setFormData] = useState({
        search: '',
        searchType: 'Title'
    })

    const handleFormSubmit = () => {
        event.preventDefault();
        handleFilter();
    };

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFilter = async () => {
        let titleSelectedAZ = true;
        let titleSelectedZA = false;
        try {
            let titleSelectorZA = document.getElementById('title-za')
            titleSelectedZA = titleSelectorZA.checked;
        }
        catch { }
        let yearBefore = document.getElementById('yearBefore').value == '' ? 0 : document.getElementById('yearBefore').value
        let yearAfter = document.getElementById('yearAfter').value == '' ? 9999 : document.getElementById('yearAfter').value
        let searchBar = document.getElementById('search-bar').value

        if (titleSelectedAZ && titleSelectedZA) 
        {
            titleSelectedAZ = false;
        }

        let data = {'search': searchBar,
                    'searchType': formData.searchType,
                    'AZ': titleSelectedAZ,
                    'ZA': titleSelectedZA,
                    'yearBefore': parseInt(yearBefore),
                    'yearAfter': parseInt(yearAfter) }    
        let filtered_books = await api.post('/filter/', data)
        setBooks(Array.from(filtered_books.data))
    }

    useEffect(() => {
        const grab_books = async () => {
            const booksResponse = await api.get("/books/")
            if (booksResponse.data !== undefined)
            {
                setBooks(Array.from(booksResponse.data))
            }
        }

        grab_books()
    }, [])

    return (
        <div className="page-wrapper"> {/* Wrapper div with the background gradient */}
            <Navbar/>
            <div className="row-resize">
                <div className="filter-container">
                    <h5 className="center-text">Filters</h5>

                    <div className="ml-2">
                        <input type="radio" id='title-az' name="filters" value='AZ'/>
                        <label style={{marginLeft: '4px'}} htmlFor='title-az'>Sort by Title A-Z</label> <br/>
                        <input type="radio" id='title-za' name="filters" value='ZA'/>
                        <label style={{marginLeft: '4px'}} htmlFor='title-za'>Sort by Title Z-A</label> <br/>
                        <label>Published between</label> <br/>
                        <input style={{ marginRight: '5px'  , width: '80px'}} id="yearBefore" type="number"/>
                        <label>and</label>
                        <input style={{ marginLeft: '5px', width: '80px'}} id='yearAfter' type="number"/>
                    </div>
                    <button className="btn btn-primary mr-2 mt-3" style={{ float: 'right'}} onClick={handleFilter}>Apply</button>
                </div>

            <div className="books-container mt-4 mb-4">
                <form onSubmit={handleFormSubmit} style={{ marginTop: '80px', marginLeft: '25px' }}>
                    <div className="row mb-3 row_resize">
                        <select className="form-select" id="search-bar-type" name="searchType" onChange={handleInputChange} value={formData.searchType}>
                            <option value='Title' defaultValue='Title'>Title</option>
                            <option value='Author'>Author</option>
                            <option value='Genre'>Genre</option>
                            <option value='ISBN'>ISBN</option>
                        </select>

                            <input type='text' className='form-control text_resize' placeholder='Search' id='search-bar' name='search'  onChange={handleInputChange} value={formData.search}/>
                            
                            <button type='submit' className='btn btn-primary search_button'>
                                Search
                            </button>
                        </div>
                    </form>
                    
                    <BookList bookList={books}/>
                </div>
            </div>
        </div>
    );
}
