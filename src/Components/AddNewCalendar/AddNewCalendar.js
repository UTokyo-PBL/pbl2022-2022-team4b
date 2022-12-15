import './AddNewCalendar.css'
import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation} from "react-router-dom";
import Container from '@mui/material/Container';
import Cookies from 'js-cookie';
import PubSub from 'pubsub-js'
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";

const AddNewCalendar = (props) => {
    const theme = createTheme();
    const token = useLocation()['state']
    var userInfo;
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,};

    axios.get('api/account/user/',{headers: headers})
    .then(res => {
        userInfo = res.data;
    }).catch(err => {
        console.log('Failed  api/account/user/'); 
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post('api/scheduler/calendars/', 
            {   'owner': [userInfo['email']],
                'title': data.get('Calendar'),
                'description': data.get('Description'),
                'members': [data.get('Members')],
                'guests': [data.get('Guests')]},
            {headers: headers},
        ).then(res => {
            PubSub.publish('dialogOpen', true);
        }).catch(err => {
            console.log('Fail api/scheduler/calendars/');
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <div className='add-event-title'> Create New Calendar</div>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Calendar"
                        label="Calendar Name"
                        name="Calendar"
                        autoComplete="Calendar"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="Description"
                        label="Description"
                        type="Description"
                        id="Description"
                        autoComplete="Description"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="Members"
                        label="Members"
                        type="Members"
                        id="Members"
                        autoComplete="Members"
                    />
                    <Button
                        type="submit"
                        // fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default AddNewCalendar;