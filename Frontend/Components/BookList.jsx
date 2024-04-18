import React, { useEffect, useState } from "react";
import { Book } from "./Book";
import api from "../src/api";
import '../src/CSS/browse.css'

export const BookList = () => {
    const [books, setBooks] = useState([])

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
        <div className="book-list">
            {books !== undefined && books.map((book, index) => (
                <Book key={index} isbn={book.isbn} title={book.title} 
                author={book.author} publisher={book.publisher} pageCount={book.page_count}
                publishYear={book.published_year} category={book.category}/>
            ))}
        </div>
    )
}