import React from 'react';
import { Navigate } from "react-router-dom";
import SignIn from '../Components/SignIn'
import SignUp from '../Components/SignUp'
import HomePage from '../Components/HomePage';


export default [

    {
        path: '/login',
        element: <SignIn />
    },
    {
        path: '/register',
        element: <SignUp />
    },
    {
        path: '/main',
        element: <HomePage />
    },
    {
        path: '/',
        element: <Navigate to='/login' />
    }
]



