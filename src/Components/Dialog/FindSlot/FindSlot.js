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
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PubSub from 'pubsub-js'
import Cookies from 'js-cookie';
import axios from 'axios'

const FindSlot = (props) => {
    const theme = createTheme();
    const token = useLocation()['state'];
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,};
    const [calendarInfo, setCalendarInfo] = useState({id:'all',title:'all',description:'all calendars',owner:'',members:[],guests:[]});
    const [open, setOpen] = useState(false);
    const handleClose = () => { setOpen(false)}
    const [startTime, setStartTime] = useState(new Date());
    const handleStartTimeChange = (newValue) => {setStartTime(new Date(newValue));};
    const [endTime, setEndTime] = useState(new Date());
    const handleEndTimeChange = (newValue) => {setEndTime(new Date(newValue));};
    useEffect(() => {
        PubSub.subscribe('findSlotDialog', (_, data) => {setOpen(data)});
        PubSub.subscribe('selectedCalendarInfo', (_, data) => {setCalendarInfo(data)});
    }, [])
    const toIsoString= (date)  => {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                return (num < 10 ? '0' : '') + num;
            };
      
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
      }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post('http://34.146.199.221/api/scheduler/findslot/', 
            {   'start_time':toIsoString(startTime) ,
                'end_time':toIsoString(endTime) ,
                'duration': data.get('Duration'),
                'start_index': 0,
                'end_index': 9
    },
            {headers: headers},
        ).then(res => {
            if(res.data instanceof Array ){
            PubSub.publish('chooseSlotDialog', true);
            PubSub.publish('chooseSlotDialogData', {'startTime':startTime,'endTime':endTime,'duration':data.get('Duration')});
            PubSub.publish('findSlotDialogData', res.data);
            }
        }).catch(err => {
            console.log('Fail api/scheduler/findslot/');
        });
        setOpen(false);
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Duration"
                            label="Duration in minutes"
                            name="Duration"
                            autoComplete="Duration"
                            autoFocus
                        />
                            <DateTimePicker
                            id="startTime"
                            label="From"
                            name = "startTime"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                            <DateTimePicker
                            id="endTime"
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