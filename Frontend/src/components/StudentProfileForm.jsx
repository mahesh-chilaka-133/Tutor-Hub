import React, { useState } from 'react';
import api from '../services/api';

/**
 * This form allows a student to update their basic profile details.
 * It takes the current user object as a prop to pre-fill the form fields.
 */

const StudentProfileForm = ({ user }) => {
    // State to manage the form's input fields
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || ''
    });

    // State for handling success or error messages after submission
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // A single handler to update the state as the user types in any input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear previous messages
        setError('');
        setSuccess('');

        // Prevent empty submissions
        if (!formData.name || !formData.email) {
            setError("Name and email fields cannot be empty.");
            return;
        }

        try {
            // Send a PUT request to the new backend endpoint
            await api.put('/auth/updatedetails', formData);
            setSuccess('Profile updated successfully! Changes will be reflected on your next login.');
        } catch (err) {
            // Display any errors from the backend
            setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="profile-form-container">
            <h3>Edit Your Profile</h3>
            <p>Update your name or email address.</p>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* Note: Password changes are complex and should ideally be in a separate, dedicated form for security. */}
                
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default StudentProfileForm;