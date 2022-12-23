import React from 'react';
import { Navigate } from "react-router-dom";
import SignIn from '../Components/SignIn'
import SignUp from '../Components/SignUp'
import HomePage from '../Components/HomePage'
import Settings from '../Components/Settings'
import Account from '../Components/Settings/Account'
import Groups from '../Components/Settings/Groups'
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
        path: 'settings',
        element: <Settings/>,
        children:[
            {
                path: 'account',
                element: <Account/>,
            },
            {
                path: 'groups',
                element: <Groups/>,
            },
            {
                path: '',
                element: <Navigate to='account' />
            }
        ]
    },
    {
        path: '/',
        element: <Navigate to='/login' />
    }
]



