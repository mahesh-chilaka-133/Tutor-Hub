import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import HomePage from './HomePage';
import LoggedInHomePage from './LoggedInHomePage';

const Home = () => {
    // Get both isLoggedIn and the user object from the context
    const { isLoggedIn, user } = useContext(AuthContext);

    // Pass the user object as a prop to LoggedInHomePage
    return isLoggedIn ? <LoggedInHomePage user={user} /> : <HomePage />;
};

export default Home;