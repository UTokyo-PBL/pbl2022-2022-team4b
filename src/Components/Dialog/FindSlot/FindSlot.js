import React,{useState,useEffect} from 'react';
import { useLocation} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import SearchIcon from '@mui/icons-material/Search';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PubSub from 'pubsub-js'
import Cookies from 'js-cookie';
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";

const FindSlot = (props) => {
    const theme = createTheme();
    const token = useLocation()['state']
    var userInfo;
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,};
    axios.get('api/account/user/',{headers: headers}).then(res => {userInfo = res.data;}).catch(err => {console.log('Failed  api/account/user/'); });
    const [calendarInfo, setCalendarInfo] = useState({id:'all',title:'all',description:'all calendars',owner:'',members:[],guests:[]});
    const [open, setOpen] = useState(false);
    const handleClose = () => { setOpen(false)}
    const [startTime, setStartTime] = useState(new Date());
    const handleStartTimeChange = (newValue) => {setStartTime(new Date(newValue));};
    const [endTime, setEndTime] = useState(new Date());
    const handleEndTimeChange = (newValue) => {setEndTime(new Date(newValue));};
    const [duration, setDuration] = useState(new Date());
    const handleDurationChange = (newValue) => {setDuration(newValue);};
    useEffect(() => {
        PubSub.subscribe('findSlotDialog', (_, data) => {setOpen(data)});
        PubSub.subscribe('selectedCalendarInfo', (_, data) => {setCalendarInfo(data)});
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        // axios.post('api/scheduler/calendars/', 
        //     {   'owner': [userInfo['email']],
        //         'title': data.get('Calendar'),
        //         'description': data.get('Description'),
        //         'members': [data.get('Members')],
        //         'guests': [data.get('Guests')]},
        //     {headers: headers},
        // ).then(res => {
            console.log(startTime,endTime,duration);
            PubSub.publish('findSlotDialog', false);
        // }).catch(err => {
        //     console.log('Fail api/scheduler/calendars/');
        // });
    };


    return (
        <Dialog onClose={handleClose} open={open}>
        <ThemeProvider theme={theme}>
            <Container component="main" sx={{width:'400px'}} maxWidth="xs">
                <Typography sx={{mb:3,height: '40px',paddingTop: '15px',textAlign: 'center',fontSize: '20px'}} variant="h6" component="div">
                Find slot in  :  {calendarInfo['title']}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 , width : '100%'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <TimePicker
                            ampm={false}
                            openTo="hours"
                            views={['hours', 'minutes']}
                            inputFormat="HH:mm"
                            mask="__:__"
                            label="Duration"
                            value={duration}
                            onChange={handleDurationChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                            <DateTimePicker
                            label="From"
                            name = "startTime"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                            <DateTimePicker
                            label="To"
                            name = "endTime"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                        
                    </LocalizationProvider>

                    <Button
                        startIcon={<SearchIcon/>}
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Find
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
        </Dialog>
    );
};

export default FindSlot;