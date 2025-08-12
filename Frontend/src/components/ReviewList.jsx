import React from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews }) => {
    if (reviews.length === 0) {
        return <p>No reviews yet. Be the first to leave one!</p>;
    }

    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review._id} className="review-card">
                    <p className="review-author"><strong>{review.student.name}</strong> says:</p>
                    <p className="review-rating">Rating: {'⭐'.repeat(review.rating)}</p>
                    <p className="review-feedback">"{review.feedback}"</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;  