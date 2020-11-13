import React from 'react'
import { useAuthContext } from '../context/AuthContext'
import Login from './Login';
import UsersTable from './UsersTable';

const Home = () => {
    const authContext = useAuthContext();
    const { isAuthenticated } = authContext;

    return isAuthenticated() ? <UsersTable /> : <Login />
}

export default Home
