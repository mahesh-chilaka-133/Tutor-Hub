import React, { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * A form for tutors to edit their profile details.
 * It now receives its initial data via props and calls a callback on update.
 */
const TutorProfileForm = ({ initialProfile, onProfileUpdate }) => {
    // State for the form's input fields
    const [formData, setFormData] = useState({
        subjects: '',
        bio: '',
        availability: ''
    });
    
    // State for success/error messages
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // This effect populates the form once the initialProfile prop is ready
    useEffect(() => {
        // Only update the form if the profile data exists
        if (initialProfile) {
            setFormData({
                subjects: initialProfile.subjects?.join(', ') || '',
                bio: initialProfile.bio || '',
                availability: initialProfile.availability?.join(', ') || '',
            });
        }
    }, [initialProfile]); // This runs whenever the initialProfile prop changes

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const profileData = {
            subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
            bio: formData.bio,
            availability: formData.availability.split(',').map(s => s.trim()).filter(Boolean),
        };
        
        try {
            await api.put('/tutors/my-profile', profileData);
            setSuccess('Profile updated successfully!');
            
            // If the onProfileUpdate function was provided as a prop, call it
            if (onProfileUpdate) {
                onProfileUpdate();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile.');
        }
    };

    return (
        <div className="profile-form-container">
            <h3>Edit Your Tutor Profile</h3>
            <form onSubmit={handleSubmit}>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Subjects (comma-separated)</label>
                    <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g., Math, Physics, English" />
                </div>
                <div className="form-group">
                    <label>Bio / About Me</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell students about your teaching style..."></textarea>
                </div>
                <div className="form-group">
                    <label>Availability (comma-separated)</label>
                    <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., Weekday Evenings, Weekends" />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default TutorProfileForm;