import React,{useState,useEffect} from 'react';
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
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PubSub from 'pubsub-js'

const ChooseSlot = (props) => {
    const theme = createTheme();
    const [open, setOpen] = useState(false);
    const handleClose = () => { setOpen(false)};
    const [value, setValue] = useState('');
    const [calendarInfo, setCalendarInfo] = useState({id:'all',title:'all',description:'all calendars',owner:'',members:[],guests:[]});
    const [Target, setTarget] = useState({});
    const [freeslot, setFreeslot] = useState([])
    useEffect(() => {
        PubSub.subscribe('chooseSlotDialog', (_, data) => {setOpen(data)});
        PubSub.subscribe('findSlotDialogData', (_, data) =>{setFreeslot(data);});
        PubSub.subscribe('selectedCalendarInfo', (_, data) => {setCalendarInfo(data)});
        PubSub.subscribe('chooseSlotDialogData', (_, data) => {setTarget(data)} );
    }, [])
    const todate= (iso_string)  => {
        const Start_time = new Date(iso_string)
        return Start_time.getFullYear()+'-'+ (Start_time.getMonth() + 1)+ '-' + Start_time.getDate()+
        '  ' + Start_time.getHours() +
        ':' + Start_time.getMinutes()
    };
    const handleRadioChange = (event) => {
        setValue(event.target.value);
      };
    const Slots = freeslot.map((item,i) => {
        console.log('logging'+item);
        return <FormControlLabel key={item[0]} value={item[0]} control={<Radio />} label={`Start from ${todate(item[0])} with ${item[2]} conflicts`} />
     })

     const handleSubmit = (event) =>{
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var end_time =  new Date(value)
        end_time.setMinutes(end_time.getMinutes()+parseInt(Target.duration));
        props.addTask({
            'title': data.get('Title'),
            'description': '',
            'calendar': calendarInfo['id'],
            'start': value ,
            'end':  end_time
        })
        setOpen(false);
     };
    return (
        <Dialog onClose={handleClose} open={open}>
        <ThemeProvider theme={theme}>
            <Container component="main" sx={{width:'400px'}} maxWidth="xs">
                <Typography sx={{mb:3,height: '40px',paddingTop: '15px',textAlign: 'center',fontSize: '20px'}} variant="h6" component="div">
                Found slot in  :  {calendarInfo['title']}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 , width : '100%'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                        <TextField
                            margin="normal"
                            required
                            disabled
                            fullWidth
                            id="Duration"
                            label={Target.duration}
                            name="Duration"
                            autoComplete="Duration"
                            autoFocus
                        />
                        </Stack>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Title"
                            label="Title of Tasks"
                            name="Title"
                            autoComplete="Unnamed Task"
                            autoFocus
                        />
                        <RadioGroup
                        aria-labelledby="demo-error-radios"
                        name="quiz"
                        value={value}
                        onChange={handleRadioChange}
                        >{Slots}
                        </RadioGroup>
                        
                    </LocalizationProvider>
                   
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Task
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
        </Dialog>
    );
}
export default ChooseSlot;