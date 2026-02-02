import React from 'react';
import { FaUserEdit } from 'react-icons/fa';

/**
 * A simple display card for a student's profile information.
 * It shows the user's name and email and includes a button that, when clicked,
 * invokes a callback function passed down from the parent component (DashboardPage)
 * to open the profile editing form.
 *
 * @param {object} user - The logged-in user object containing name and email.
 * @param {function} onEditClick - The callback function to be called when the edit button is clicked.
 */
const StudentProfileInfo = ({ user, onEditClick }) => {
    // A fallback in case the user prop isn't available yet
    if (!user) {
        return <div className="profile-info-card"><p>Loading profile...</p></div>;
    }

    return (
        <div className="profile-info-card">
            <h3>Your Profile</h3>
            
            {/* Display Item for Name */}
            <div className="info-item">
                <strong>Name:</strong>
                <span>{user.name}</span>
            </div>
            
            {/* Display Item for Email */}
            <div className="info-item">
                <strong>Email:</strong>
                <span>{user.email}</span>
            </div>

            {/* 
              This button doesn't contain any logic itself. It simply calls the 
              onEditClick function that was passed down from the DashboardPage.
              This is a great example of lifting state up, where the parent
              manages the state (isProfileOpen) and the child triggers changes.
            */}
            <button className="edit-profile-button" onClick={onEditClick}>
                <FaUserEdit /> Edit Profile
            </button>
        </div>
    );
};

export default StudentProfileInfo;