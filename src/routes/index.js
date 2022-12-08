import React from 'react';
import { Navigate } from "react-router-dom";
import SignIn from '../Components/SignIn'
import SignUp from '../Components/SignUp'
import Sidebar from "../Components/Sidebar"
import Calendar from "../Components/Calendar"


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
        element: <><Sidebar /><Calendar /></>

    },
    {
        path: '/',
        element: <Navigate to='/login' />
    }
]



