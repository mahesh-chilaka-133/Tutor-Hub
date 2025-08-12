const generateBookingConfirmationEmail = (studentName, tutorName, subject, sessionDate) => {
    const formattedDate = new Date(sessionDate).toLocaleString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>TutorHub Session Confirmed</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007bff;">Your TutorHub Session is Confirmed!</h2>
            <p>Hi ${studentName},</p>
            <p>We're excited to let you know that your session with ${tutorName} for ${subject} has been confirmed.</p>
            <p>
                <strong>Date and Time:</strong> ${formattedDate}
            </p>
            <p>We look forward to helping you learn!</p>
            <p>Best regards,</p>
            <p>The TutorHub Team</p>
        </div>
    </body>
    </html>
    `;
};
const generateWelcomeEmail = (name, role) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to TutorHub!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007bff;">Welcome to TutorHub, ${name}!</h2>
            <p>
                Thank you for joining TutorHub. We're thrilled to have you as a ${role}.
                Get ready to connect with students (if you're a tutor) or find the perfect tutor (if you're a student).
            </p>
            <p>
                To get started, explore our platform and start connecting with tutors or finding your dream students.
            </p>
            <p>If you are a tutor, don't forget to complete your profile so students can discover you!
            </p>
            <p>
                Best regards,<br>
                The TutorHub Team
            </p>
        </div>
    </body>
    </html>
    `;
};

module.exports = { generateBookingConfirmationEmail, generateWelcomeEmail };