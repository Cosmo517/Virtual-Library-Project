import { useEffect, useState } from 'react';
import { Navbar } from "../Components/Navbar";
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
                {title: 'Largest Book:', fact: `Title: ${data1.title}, Pages: ${data1.page_count}` },
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
            <div className="hero">
                    <h1>Virtual Library</h1>
                    <h2>Web Portal for the Home Library</h2>
                </div>
            <div className="container_edited mt-5"> {/* Added mt-5 to give a margin from the top */}
                <div className='row justify-content-center'> {/* Center the content horizontally */}
                    {/* Fact 1 */}
                    <div className="dashboard_long_facts dashboard_long_fact_1">
                        <h1>Fact 1!</h1>
                        {funFacts.length > 0 && (
                            <div className="dashboard_long_facts_1">
                                <h2>{funFacts[0].title}</h2>
                                <p>{funFacts[0].fact}</p>
                            </div>
                        )}
                    </div>
                    {/* Fact 2 */}
                    <div className='column'>
                        <div className="dashboard_short_facts">
                            <h1>Fact 2!</h1>
                            {funFacts.length > 1 && (
                                <div className="dashboard_short_facts_2"> {/* Changed from "dashboard_long_facts_2" to "dashboard_short_facts_2" */}
                                    <h2>{funFacts[1].title}</h2>
                                    <p>{funFacts[1].fact}</p>
                                </div>
                            )}
                        </div>
    
                        {/* Fact 3 */}
                        <div className="dashboard_short_facts">
                            <h1>Fact 3!</h1>
                            {funFacts.length > 2 && (
                                <div className="dashboard_short_facts_3"> {/* Changed from "dashboard_long_facts_3" to "dashboard_short_facts_3" */}
                                    <h2>{funFacts[2].title}</h2>
                                    <p>{funFacts[2].fact}</p>
                                </div>
                            )}
                        </div>
                    </div>
    
                    {/* Fact 4 */}
                    <div className="dashboard_long_facts dashboard_long_fact_4">
                        <h1>Fact 4!</h1>
                        {funFacts.length > 3 && (
                            <div className="dashboard_long_facts_4">
                                <h2>{funFacts[3].title}</h2>
                                <p>{funFacts[3].fact}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
