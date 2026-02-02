import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserShield } from 'react-icons/fa';
import TutorCard from '../components/features/tutor/TutorCard'; // We can reuse the same card component
import './TutorPreviewPage.css'; // New styles for this page

const TutorPreviewPage = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPreviewTutors = async () => {
            try {
                // Fetch a limited number of tutors using a query parameter
                const response = await axios.get('http://localhost:5000/api/tutors?limit=5');
                setTutors(response.data.data);
            } catch (err) {
                setError('Could not load tutor previews at this time.');
            } finally {
                setLoading(false);
            }
        };

        fetchPreviewTutors();
    }, []);

    return (
        <div className="tutor-preview-page">
            <div className="preview-header">
                <h1>Meet Some of Our Top Tutors</h1>
                <p>Here is a sample of the highly-qualified experts available on TutorHub.</p>
            </div>

            {loading && <p>Loading tutors...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <div className="tutors-container">
                    {tutors.map(tutor => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                </div>
            )}

            {/* --- MEMBERS-ONLY CTA SECTION --- */}
            <div className="cta-section">
                <FaUserShield className="cta-icon" />
                <h2>See Our Full Roster of Tutors</h2>
                <p>Create a free account or log in to browse hundreds of tutors, view detailed profiles, and book your first session.</p>
                {/* This link goes to the protected /tutors route, which will trigger the login redirect */}
                <Link to="/tutors" className="btn-cta">
                    Login to See All Tutors
                </Link>
            </div>
        </div>
    );
};

export default TutorPreviewPage;