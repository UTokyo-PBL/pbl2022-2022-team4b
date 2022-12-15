import React, { useState } from 'react';
import SignIn from '../component/SignIn/SignIn';
import SignUp from '../component/SignUp/SignUp.js';
import HomePage from '../component/HomePage/HomePage';
import {Routes,Route,useNavigate} from "react-router-dom";

import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
    const navigate = useNavigate();
    const [token,setToken] = useState('');
    const Login = (data)=>{
        axios.post('api/authorization',{
            email: data.get('email'),
            password: data.get('password'),
          })
          .then(res => {
            setToken(res.data['Authorization']);
            navigate('/index');
        }).catch(err => {
          console.log('Fail api/authorization'); 
        });
    };
    
    return (
        <>
             <Routes>
                <Route path="/index" element = {<HomePage token={token} />} ></Route>
                <Route path="/login" element = {<SignIn Login={Login}/>}></Route>
                <Route path = "/register" element = {<SignUp/>}></Route>
            </Routes>
        </>
   
    );
};

export default App;