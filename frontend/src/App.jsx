import React, { useContext, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// --- Component Imports ---
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// --- Page Imports (All pages created for the project) ---
import HomePage from './pages/HomePage';                 // Public landing page
import LoggedInHomePage from './pages/LoggedInHomePage';   // Welcome page for logged-in users
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorPreviewPage from './pages/TutorPreviewPage'; // Public page for sample tutors
import TutorListPage from './pages/TutorListPage';       // Full, protected list of tutors
import TutorDetailPage from './pages/TutorDetailPage';     // Protected tutor detail page
import DashboardPage from './pages/DashboardPage';       // Protected user dashboard
import NotFoundPage from './pages/NotFoundPage';         // Fallback for any non-existent route
// import VideoCallPage from './pages/VideoCallPage';
const VideoCallPage = lazy(() => import('./pages/VideoCallPage'));

import Footer from './components/layout/Footer';

// --- Stylesheet ---
import './App.css';

/**
 * A helper component that acts as a switch to render the correct "home" page.
 * It uses the global AuthContext to check the user's login status.
 */
const HomeRouter = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // If the user is logged in, show them the personalized welcome page.
  // Otherwise, show them the public-facing marketing page.
  return isLoggedIn ? <LoggedInHomePage /> : <HomePage />;
};


/**
 * The main App component that defines the entire application's routing structure.
 */
function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          {/* --- Public Routes (Accessible to everyone) --- */}
          <Route path="/" element={<HomeRouter />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tutor-preview" element={<TutorPreviewPage />} />

          {/* --- Protected Routes (User MUST be logged in to access) --- */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/tutors"
            element={<ProtectedRoute><TutorListPage /></ProtectedRoute>}
          />
          <Route
            path="/tutor/:id"
            element={<ProtectedRoute><TutorDetailPage /></ProtectedRoute>}
          />
          <Route
            path="/session/:sessionId/call"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Loading Video Call...</div>}>
                  <VideoCallPage />
                </Suspense>
              </ProtectedRoute>
            }
          />


          {/* --- Catch-all 404 Route --- */}
          {/* This route will match any path that wasn't matched above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;