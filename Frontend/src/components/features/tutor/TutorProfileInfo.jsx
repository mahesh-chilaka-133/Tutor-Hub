import React from 'react';
import { FaUserEdit } from 'react-icons/fa';

/**
 * A display card for a tutor's profile summary on the dashboard sidebar.
 * Includes a button to open the main profile editor.
 */
const TutorProfileInfo = ({ tutor, onEditClick }) => {
    return (
        <div className="profile-info-card">
            <h3>Your Tutor Profile</h3>
            <div className="info-item">
                <strong>Subjects:</strong>
                <span>{tutor.subjects?.join(', ') || 'Not set'}</span>
            </div>
            <div className="info-item">
                <strong>Availability:</strong>
                <span>{tutor.availability?.join(', ') || 'Not set'}</span>
            </div>
            <div className="info-item">
                <strong>Bio:</strong>
                <p className="bio-summary">{tutor.bio || 'Not set'}</p>
            </div>
            <button className="edit-profile-button" onClick={onEditClick}>
                <FaUserEdit /> Edit Full Profile
            </button>
        </div>
    );
};

export default TutorProfileInfo;