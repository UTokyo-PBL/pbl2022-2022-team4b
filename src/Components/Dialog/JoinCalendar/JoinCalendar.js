import React,{useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation} from "react-router-dom";
import Container from '@mui/material/Container';
import PubSub from 'pubsub-js'
import Cookies from 'js-cookie';
import axios from 'axios'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
axios.defaults.baseURL = "http://localhost:8080";

const JoinCalendar = (props) => {
    const theme = createTheme();
    const token = useLocation()['state']
    const [open, setOpen] = useState(false);
    const [userInfo,setUserInfo] = useState({});
    const handleClose = () => {setOpen(false)}
    const headers = {'X-CSRFToken': Cookies.get('csrftoken'),'authorization': 'Token ' + token,};
    useEffect(() => {
        PubSub.subscribe('joinCalendarDialog', (_, data) => {setOpen(data)});
        PubSub.subscribe('userInfo', (_, data) => {setUserInfo(data)});
    }, [])
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // axios.post('api/scheduler/calendars/', 
        //     {   'owner': [userInfo['email']],
        //         'title': data.get('Calendar'),
        //         'description': data.get('Description'),
        //         'members': [data.get('Members')],
        //         'guests': [data.get('Guests')]},
        //     {headers: headers},
        // ).then(res => {
        //     PubSub.publish('joinCalendarDialog', false);
        //     props.getCalendarsAsync();
        // }).catch(err => {
        //     console.log('Fail api/scheduler/calendars/');
        // });
    };

    return (
        <Dialog onClose={handleClose} open={open}>
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
            <Typography sx={{mb:3,height: '40px',paddingTop: '15px',textAlign: 'center',fontSize: '20px'}} variant="h6" component="div">Join calendar</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Invite Code"
                        label="Invite Code"
                        name="InviteCode"
                        autoComplete="Invite Code"
                        autoFocus
                    />
                    <Button
                        startIcon={<GroupAddIcon/>}
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 ,textAlign:'center'}}
                    >
                        Join
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
        </Dialog>
    );
};

export default JoinCalendar;