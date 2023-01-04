import React,{useState,useEffect} from 'react';
import { useLocation} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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

const ChooseSlot = (props) => {
    const theme = createTheme();
    const token = useLocation()['state'];
    const [userInfo,setUserInfo] = useState({});
    const [value, setValue] = React.useState('');
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,};
    const [calendarInfo, setCalendarInfo] = useState({id:'all',title:'all',description:'all calendars',owner:'',members:[],guests:[]});
    const [freeslot, setfreeslot] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClose = () => { setOpen(false)}
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [duration, setDuration] = useState(new Date());
    const [events, setEvents] = useState([]);
    useEffect(() => {
        PubSub.subscribe('chooseSlotDialog', (_, data) => {
            setOpen(data);
            console.log("received")});
        PubSub.subscribe('chooseSlotDialogData', (_, data) => {
            setStartTime(data.startTime);
            setEndTime(data.endTime);
            setDuration(data.duration);
                console.log("received1")});
        PubSub.subscribe('selectedCalendarInfo', (_, data) => {setCalendarInfo(data)});
        PubSub.subscribe('userInfo', (_, data) => {setUserInfo(data)});
        PubSub.subscribe('findSlotDialogData', (_, data) => {setfreeslot([data])});
    }, []);


    const handleEdit = () => {
        setOpen(false)
        PubSub.publish('findSlotDialog', true)}

    const handleRadioChange = (event) => {
        setValue((event.target).value); 
        };
    const getEventsAsync = async (id) => {
            try {
                const res = await axios.get('api/scheduler/tasks/?calendar=' + id, { headers: headers });
                await setEvents(res.data);
            }
            catch (err) {
                console.log('Failed api/scheduler/tasks/?calendar=');
            };
        }
    const addTask = (event) => {
        const endtime = new Date(value);
        endtime.setMinutes(endTime.getMinutes()+duration);
            axios.post('api/scheduler/tasks/', {
                'title': event.currentTarget.get('Title'),
                'description': '',
                'calendar': 'all',
                'start_time': new Date(value),//start_time
                'end_time': endtime
            },
                {
                    headers: headers
                }).then(res => {
                    // getEventsAsync('all');
                }).catch(err => {
                    console.log('Failed api/scheduler/calendars/');
                });
            console.log('create')
        }
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     axios.post('api/scheduler/tasks/', {
    //         'title': event['title'],
    //         'description': '',
    //         'calendar': 'all',
    //         'start_time': event['start'],
    //         'end_time': event['end']
    //     },
    //     {
    //         headers: headers
    //     }).then(res => {
    //         console.log('submitted1');
    //         console.log('Published1');
    //         setTimeout(()=>PubSub.publish('chooseSlotDialog', false),1000);
    //         console.log('Out1');
    //     }).catch(err => {
    //         console.log('Fail api/scheduler/calendars/');
    //     });
    // };
    const Slots = freeslot.map((item) => {
       return <FormControlLabel value={item[0]} control={<Radio />} label={`Start from ${item[0]} with ${item[2]} conflicts`} />
    })
    ;


    return (
        <Dialog onClose={handleClose} open={open}>
        <ThemeProvider theme={theme}>
            <Container component="main" sx={{width:'400px'}} maxWidth="xs">
                <Typography sx={{mb:3,height: '40px',paddingTop: '15px',textAlign: 'center',fontSize: '20px'}} variant="h6" component="div">
                Found slot in  :  {calendarInfo['title']}
                </Typography>
                <Box component="form" onSubmit={handleEdit} noValidate sx={{ mt: 1 , width : '100%'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <TimePicker
                            ampm={false}
                            disabled
                            openTo="hours"
                            views={['hours', 'minutes']}
                            inputFormat="HH:mm"
                            mask="__:__"
                            label="Duration"
                            value={duration}
                            renderInput={(params) => <TextField {...params} />}
                            />
                            <DateTimePicker
                            disabled
                            label="From"
                            name = "startTime"
                            value={startTime}
                            renderInput={(params) => <TextField {...params} />}
                            />
                            <DateTimePicker
                            disabled
                            label="To"
                            name = "endTime"
                            value={endTime}
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                        <Button
                        startIcon={<SearchIcon/>}
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        Edit
                        </Button>
                        
                    </LocalizationProvider>
                </Box>
                <Box component="form" onSubmit={addTask} noValidate sx={{ mt: 1 , width : '100%'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Title"
                            label="Event Title"
                            name="Title"
                            autoComplete="Title"
                            autoFocus
                        />
                        <RadioGroup
                        aria-labelledby="demo-error-radios"
                        name="Availble slot"
                        value={value}
                        onChange={handleRadioChange}
                        >
                        {Slots}
                        </RadioGroup>
                        <Button
                        startIcon={<SearchIcon/>}
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        Confirm and submit!
                        </Button>
                        </Stack>
                    </LocalizationProvider>
                </Box>
            </Container>
        </ThemeProvider>
        </Dialog>
    );
}
export default ChooseSlot;