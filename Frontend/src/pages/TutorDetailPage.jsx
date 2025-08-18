import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FaBookOpen, FaCalendarAlt, FaUser, FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import BookingModal from '../components/BookingModal';

import './TutorDetailPage.css';

const TutorDetailPage = () => {
    const { id } = useParams();
    const { isLoggedIn, user } = useContext(AuthContext);

    const [tutor, setTutor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTutorData = useCallback(async () => {
        setLoading(true);
        try {
            const [tutorResponse, reviewsResponse] = await Promise.all([
                api.get(`/tutors/${id}`),
                api.get(`/reviews/tutor/${id}`)
            ]);
            setTutor(tutorResponse.data.data);
            setReviews(reviewsResponse.data.data);
        } catch (err) {
            console.error('Error fetching tutor details:', err);
            setError('Failed to fetch tutor details. The tutor may not exist.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTutorData();
    }, [fetchTutorData]);

    if (loading) return <div className="page-container"><p>Loading profile...</p></div>;
    if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
    if (!tutor) return <div className="page-container"><p>Tutor not found.</p></div>;

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : 'No ratings';

    return (
        <>
            {isBookingModalOpen && (
                <BookingModal tutor={tutor} onClose={() => setIsBookingModalOpen(false)} />
            )}

            <div className="tutor-detail-page">
                <div className="profile-grid">
                    <main className="profile-main">
                        <div className="profile-section">
                            <h3><FaUser className="section-icon" /> About Me</h3>
                            <p className="bio-text">{tutor.bio || 'No biography provided.'}</p>
                        </div>
                        <div className="profile-section">
                            <h3><FaBookOpen className="section-icon" /> Subjects I Teach</h3>
                            <ul className="subjects-list">
                                {tutor.subjects.map((subject, index) => (
                                    <li key={index} className="subject-item">{subject}</li>
                                ))}
                            </ul>
                        </div>
                    </main>

                    <aside className="profile-sidebar">
                        <div className="action-card">
                            <div className="tutor-identity">
                                <div className="profile-avatar-placeholder">
                                    <FaUser />
                                </div>
                                <h2 className="tutor-name">{tutor.user.name}</h2>
                            </div>

                            <div className="tutor-stats">
                                <div className="stat-item">
                                    <span className="stat-value"><FaStar /> {averageRating}</span>
                                    <span className="stat-label">Overall Rating</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{reviews.length}</span>
                                    <span className="stat-label">Reviews</span>
                                </div>
                            </div>
                            
                            <div className="availability-section">
                                <h4><FaCalendarAlt className="section-icon" /> General Availability</h4>
                                <p>{tutor.availability.join(', ') || 'Not specified.'}</p>
                            </div>
                            
                            {isLoggedIn && user?.role === 'student' && (
                                <div className="booking-action">
                                    <button 
                                        className="btn-book-session" 
                                        onClick={() => setIsBookingModalOpen(true)}
                                    >
                                        Book a Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
                
                <div className="reviews-section-container">
                    <h3>Feedback & Ratings</h3>
                    <ReviewList reviews={reviews} />
                    
                    {isLoggedIn && user?.role === 'student' && (
                        <ReviewForm tutorId={id} onReviewSubmitted={fetchTutorData} />
                    )}
                </div>
            </div>
        </>
    );
};

export default TutorDetailPage;