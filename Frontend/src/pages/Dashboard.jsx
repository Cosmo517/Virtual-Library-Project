import { useEffect, useState } from 'react';
import { Navbar } from "../../Components/Navbar";
import '../CSS/dashboard_styling.css'

export const Dashboard = () => {
    const [funFacts, setFunFacts] = useState([]);

    useEffect(() => {
        // Fetch fun facts from the backend
        fetchFunFacts();
    }, []);

    const fetchFunFacts = async () => {
        try {
            // Fetch fun facts from the backend API
            const response1 = await fetch ('/funfacts largest book/');
            const response2 = await fetch ('/funfacts total amount of books/');
            // const response3 = await fetch ('/funfacts total amount of pages/');
            // const response4 = await fetch ('/funfacts top rated books/');

            if (!response1.ok || !response2.ok ) { //|| !response3.ok || !response4.ok || ) {
                throw new Error('Failed to fetch fun facts');
            }

            const data1 = await response1.json();
            const data2 = await response2.json();
            // const data3 = await response3.json();
            // const data4 = await response4.json();

            setFunFacts([
                {title: 'Largest Book:', fact: 'Title: ${data1.title}, Pages: ${data1.page_count}' },
                {title: 'Total Books:', fact: data2.toString() },
                // {title: 'Total Pages:', fact: data3.totalPages.toSTring() },
                // {title: 'Top 5 Rated Books:', fact: JSON.stringify(data4.books) }
            ]);
        } catch (error){
            console.error('Error fetching fun facts:', error);
        }
    };

    return (
        <>
            <Navbar/>
            <div className="container_edited mt-2">
                <div className="row">
                    {funFacts.map((fact, index) =>
                    <div key={index} className="dashboard_long_facts">
                        <h2>{fact.title}</h2>
                        <p>{fact.fact}</p>
                    </div>
                )}

                </div>
            </div>
        </>
    );
};
