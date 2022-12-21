import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import Container from '@mui/material/Container';
import PubSub from 'pubsub-js'
import Cookies from 'js-cookie';
import axios from 'axios'
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
axios.defaults.baseURL = "http://localhost:8080";

const AddCalendar = (props) => {
    const [userInfo,setUserInfo] = useState({});
    const [open, setOpen] = useState(false);
    const handleClose = () => { setOpen(false) }
    useEffect(() => {
        PubSub.subscribe('newCalendarDialog', (_, data) => {setOpen(data)})
        PubSub.subscribe('userInfo', (_, data) => {setUserInfo(data)});
    }, [])
    const theme = createTheme();
    const token = useLocation()['state']
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post('api/scheduler/calendars/',
            {
                'owner': [userInfo['email']],
                'title': data.get('Calendar'),
                'description': data.get('Description'),
                'members': data.get('Members').split(';'),
                'guests': data.get('Guests').split(';')
            },
            { headers: headers },
        ).then(res => {
            PubSub.publish('newCalendarDialog', false);
            props.getCalendarsAsync();
        }).catch(err => {
            console.log('Fail api/scheduler/calendars/');
        });
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Typography sx={{ mb: 3, height: '40px', paddingTop: '15px', textAlign: 'center', fontSize: '20px' }} variant="h6" component="div">Create new calendar</Typography>
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Guests"
                            label="Guests"
                            type="Guests"
                            id="Guests"
                            autoComplete="Guests"
                        />
                        <Button
                            startIcon={<AddIcon />}
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
        </Dialog>
    );
};

export default AddCalendar;