import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Import the two forms it can display
import StudentProfileForm from './StudentProfileForm';
import TutorProfileForm from './TutorProfileForm';

import './ProfileModal.css'; // We'll create these new styles

/**
 * A modal window for editing user profiles.
 * It intelligently renders the correct form (Student or Tutor) based on the user's role.
 */
const ProfileModal = ({ user, tutorProfile, onClose, onProfileUpdate }) => {
    return (
        // The modal overlay covers the entire screen
        <div className="profile-modal-overlay" onClick={onClose}>
            {/* We stop propagation on the content so clicking inside it doesn't close the modal */}
            <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="profile-modal-header">
                    <h2>My Profile</h2>
                    <button className="close-modal-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </header>

                <main className="profile-modal-body">
                    {/* --- Conditional Logic for Rendering the Correct Form --- */}
                    {user.role === 'tutor' ? (
                        <TutorProfileForm
                            initialProfile={tutorProfile}
                            onProfileUpdate={onProfileUpdate}
                        />
                    ) : (
                        <StudentProfileForm user={user} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProfileModal;