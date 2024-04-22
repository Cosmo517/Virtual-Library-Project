import { useEffect, useState } from 'react';
import { Navbar } from "../Components/Navbar";
import '../CSS/dashboard_styling.css'
import api from '../api';

export const Dashboard = () => {
    const [funFacts, setFunFacts] = useState([]);

    useEffect(() => {
        // Fetch fun facts from the backend
        fetchFunFacts();
    }, []);

    const fetchFunFacts = async () => {
        try {
            // Fetch fun facts from the backend API
            const response1 = await api.get('/funfacts largest book/');
            const response2 = await api.get('/funfacts total amount of books/');
            const response3 = await api.get('/funfacts total amount of pages/');

            setFunFacts([
                {fact: `Title: ${response1.data.title}, Pages: ${response1.data.page_count}` },
                {fact: response2.data.books },
                {fact: response3.data.pages },
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
                <div className="container_edited mt-5">
                    <div className='row justify-content-center'>
                        {/* Fact 1 */}
                            <div className="dashboard_fact_box">
                                <h1>Largest Book in Library</h1>
                                {funFacts.length > 0 && (
                                    <div>
                                    <p>{funFacts[0].fact}</p>
                            </div>
                        )}
                    </div>
        
                    {/* Fact 2 */}
                    <div className="dashboard_fact_box">
                        <h1>Total Number of Books in Library</h1>
                        {funFacts.length > 1 && (
                            <div>
                                <p>{funFacts[1].fact}</p>
                            </div>
                        )}
                    </div>

                    {/* Fact 3 */}
                    <div className="dashboard_fact_box">
                        <h1>Total Pages in Library</h1>
                        {funFacts.length > 2 && (
                            <div>
                                <p>{funFacts[2].fact}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Footer Section */}
            <footer>
                <p style={{ float: 'left' }}><strong>&copy; Virtual Library 2024, Web Portal for the Home Library</strong></p>
                <p style={{ float: 'right' }}><strong>Team 1.12.2: E.B., H.F., J.K.</strong></p>
            </footer>
        </>
    );
};
