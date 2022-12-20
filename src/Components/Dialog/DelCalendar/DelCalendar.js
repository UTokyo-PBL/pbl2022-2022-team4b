import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import Container from '@mui/material/Container';
import PubSub from 'pubsub-js'
import Cookies from 'js-cookie';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
// import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import TextField from '@mui/material/TextField';
import InboxIcon from '@mui/icons-material/Inbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
// import DraftsIcon from '@mui/icons-material/Drafts';

import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';

import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8080";

const DelCalendar = (props) => {
    const [open, setOpen] = useState(false);
    const [calendarInfo, setCalendarInfo] = useState({ id: 'all', title: 'all', description: 'all calendars', owner: '', members: [], guests: [] });
    const handleClose = () => { setOpen(false) }
    const theme = createTheme();
    const token = useLocation()['state']
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };
    useEffect(() => {
        PubSub.subscribe('delCalendarDialog', (_, data) => { setOpen(data) });
        PubSub.subscribe('selectedCalendarInfo', (_, data) => { setCalendarInfo(data) });
    }, [])

    var userInfo;
    axios.get('api/account/user/', { headers: headers })
        .then(res => {
            userInfo = res.data;
        }).catch(err => {
            console.log('Failed  api/account/user/');
        });

    const handleDel = (event) => {
        event.preventDefault();
        props.delCalendar(calendarInfo['id']);
        handleClose();
    };
    const handleEdit =(event)=>{
        event.preventDefault();
        handleClose();
        PubSub.publish('editCalendarDialog', true);
    };

    return (
        // <Dialog onClose={handleClose} open={open}>
        <Dialog onClose={handleClose} open={open}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Typography sx={{ mb: 1, height: '40px', paddingTop: '15px', textAlign: 'center', fontSize: '20px' }} variant="h6" component="div">{calendarInfo['title']}</Typography>
                    <Typography sx={{ height: '16px',  textAlign: 'center', fontSize: '12px' }} variant="h6" component="div">{calendarInfo['description']}</Typography>
                    <List>
                        {calendarInfo['owner'] &&
                            <ListItem key={calendarInfo['owner']} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ManageAccountsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={calendarInfo['owner']} />
                                </ListItemButton>
                            </ListItem>}
                    </List>
                    <Divider />
                    <List>
                        {calendarInfo['members'] ? calendarInfo['members'].map((text) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>)): <div>{'there is no member'}</div>}
                    </List>
                    <Divider />
                    <Stack direction="row">
                        <Button
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            sx={{ mt: 3, mb: 2,ml: 3,mr:1 }}
                            onClick = {handleDel}>
                            Delete
                        </Button>
                        <Button
                            startIcon={<EditIcon />}
                            variant="contained"
                            sx={{ mt: 3, mb: 2,ml:2 }}
                            onClick = {handleEdit}>
                            Edit
                        </Button>
                    </Stack>
                </Container>
            </ThemeProvider>
        </Dialog>
    );
};

export default DelCalendar;