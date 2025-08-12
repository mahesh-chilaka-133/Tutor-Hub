import React from 'react';
import { Link } from 'react-router-dom';
import './TutorCard.css';

const TutorCard = ({ tutor }) => {
    // The tutor object is populated with user details from the backend
    const { _id, user, subjects, bio } = tutor;

    return (
        <div className="tutor-card">
            <h3 className="tutor-name">{user?.name || 'Tutor Name'}</h3>
            <p className="tutor-subjects">
                <strong>Subjects:</strong> {subjects.join(', ')}
            </p>
            <p className="tutor-bio">{bio || 'No biography available.'}</p>
            <Link to={`/tutor/${_id}`} className="view-profile-btn">
                View Profile
            </Link>
        </div>
    );
};

export default TutorCard;