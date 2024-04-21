import React, { useEffect, useState } from "react";
import { Book } from "./Book";
import '../CSS/browse.css'
import '../CSS/bookslist.css'

export const BookList = ({ bookList }) => {
    const books = bookList

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