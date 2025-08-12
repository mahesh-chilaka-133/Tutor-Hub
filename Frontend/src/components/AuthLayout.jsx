import React from 'react';
import './AuthLayout.css'; // We'll create this stylesheet next

/**
 * This component provides a consistent two-column layout for all authentication pages.
 * It takes the main form content as `children` and an image source as a prop.
 */
const AuthLayout = ({ children, imageSrc, imageAlt }) => {
    return (
        <div className="auth-layout-container">
            {/* Column 1: The Form */}
            <div className="auth-form-column">
                {children}
            </div>

            {/* Column 2: The Illustration */}
            <div className="auth-image-column">
                <img src={imageSrc} alt={imageAlt} />
            </div>
        </div>
    );
};

export default AuthLayout;