import React, { useState } from 'react';
import api from '../services/api';
import './ReviewForm.css';

const ReviewForm = ({ tutorId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post(`/reviews/tutor/${tutorId}`, { rating, feedback });
            setFeedback('');
            setRating(5);
            onReviewSubmitted(); // Notify parent to refetch reviews
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Leave a Review</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                </select>
            </div>
            <div className="form-group">
                <label>Feedback</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience..."
                    required
                />
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;