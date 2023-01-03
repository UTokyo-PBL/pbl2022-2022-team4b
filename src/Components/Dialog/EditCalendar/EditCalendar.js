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
import UpgradeIcon from '@mui/icons-material/Upgrade';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
axios.defaults.baseURL = "http://localhost";

const EditCalendar = (props) => {
    const theme = createTheme();
    const token = useLocation()['state'];
    const [userInfo,setUserInfo] = useState({});
    const [calendarInfo, setCalendarInfo] = useState({ id: 'all', title: 'all', description: 'all calendars', owner: '', members: [], guests: [] });
    const [open, setOpen] = useState(false);
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };
    useEffect(() => {
        PubSub.subscribe('editCalendarDialog', (_, data) => {setOpen(data)});
        PubSub.subscribe('selectedCalendarInfo', (_, data) => { setCalendarInfo(data)});
        PubSub.subscribe('userInfo', (_, data) => {setUserInfo(data)});
    }, [])
    const handleClose = () => { setOpen(false) }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.put('api/scheduler/calendars/'+ calendarInfo['id'] +'/',
            {
                'owner': userInfo['email'],
                'title': data.get('Calendar'),
                'description': data.get('Description'),
                'members': data.get('Members').split(';'),
                'guests': data.get('Guests').split(';')
            },
            { headers: headers },
        ).then(res => {
            props.getCalendarsAsync();
            PubSub.publish('editCalendarDialog', false);
        }).catch(err => {
            console.log('Fail api/scheduler/calendars/');
        });
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Typography sx={{ mb: 3, height: '40px', paddingTop: '15px', textAlign: 'center', fontSize: '20px' }} variant="h6" component="div">Edit calendar :</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Calendar"
                            label="Calendar Name"
                            name="Calendar"
                            autoComplete="Calendar"
                            defaultValue= {calendarInfo['title']}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Description"
                            label="Description"
                            defaultValue= {calendarInfo['description']}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="Members"
                            label="Members"
                            autoComplete="Members"
                            defaultValue= {calendarInfo['members'].join(';')}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="Guests"
                            label="Guests"
                            autoComplete="Guests"
                            defaultValue= {calendarInfo['guests'].join(';')}
                        />
                        <Button
                            startIcon={<UpgradeIcon />}
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            UPDATE
                        </Button>
                    </Box>
                </Container>
            </ThemeProvider>
        </Dialog>
    );
};

export default EditCalendar;