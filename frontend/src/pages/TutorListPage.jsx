import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import api from '../services/api';
import TutorCard from '../components/features/tutor/TutorCard';
import './TutorListPage.css';

const TutorListPage = () => {
    // State to hold the original, full list of tutors from the API
    const [tutors, setTutors] = useState([]);
    // State to hold the list that is actually displayed (after filtering)
    const [filteredTutors, setFilteredTutors] = useState([]);

    // State for the search input and loading/error handling
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Effect 1: Fetch all tutors once when the component mounts ---
    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                const response = await api.get('/tutors');
                setTutors(response.data.data);
                setFilteredTutors(response.data.data); // Initially, display all tutors
            } catch (err) {
                console.error("Error fetching tutors:", err);
                setError('Failed to fetch tutors. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, []); // Empty dependency array ensures this runs only once

    // --- Effect 2: Apply frontend filter whenever the search term changes ---
    useEffect(() => {
        const result = tutors.filter(tutor => {
            // Defensive check to prevent errors with incomplete data
            if (!tutor || !tutor.user) return false;

            const searchTermLower = searchTerm.toLowerCase();

            // Check if search term matches the tutor's name
            const nameMatches = tutor.user.name.toLowerCase().includes(searchTermLower);

            // Check if search term matches any of the tutor's subjects
            const subjectMatches = tutor.subjects.some(subject =>
                subject.toLowerCase().includes(searchTermLower)
            );

            return nameMatches || subjectMatches;
        });

        setFilteredTutors(result);
    }, [searchTerm, tutors]); // Re-run this logic when search term or tutor list changes

    return (
        <div className="tutor-list-page">
            {/* --- UPDATED HEADER --- */}
            <header className="page-header">
                <h1>Find Your Perfect Tutor</h1>
                <p>Browse our verified experts by name or subject.</p>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or subject (e.g., Jane Doe, Physics)"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* --- UPDATED CONTENT AREA --- */}
            <main className="tutors-grid-container">
                {loading && <p className="loading-message">Loading Tutors...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <div className="tutors-grid">
                        {filteredTutors.length > 0 ? (
                            filteredTutors.map(tutor => (
                                <TutorCard key={tutor._id} tutor={tutor} />
                            ))
                        ) : (
                            <p className="no-results-message">No tutors found matching your criteria.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TutorListPage;