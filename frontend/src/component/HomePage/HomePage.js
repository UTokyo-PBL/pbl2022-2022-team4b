import React, { useState }  from 'react';
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";

const HomePage = (props) => {
    const [data,setData] = useState();
    if(!data){
        axios.post('api/indexData',{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': props.token,
            }
        })
        .then(res => {
            setData(res.data);
        }).catch(err => {
            console.log('Fail api/indexData'); 
        });
    }
    const test = JSON.stringify(data)
    return (
        <div>
            <h1>Home Page</h1>
            <h1>this is the data from api/indexData{data && test}</h1>
        </div>
    );
};

export default HomePage;