import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Calendar from '../Calendar';
import PopUp from '../PopUp'
import { useLocation  } from "react-router-dom";
import axios from 'axios'
import Cookies from 'js-cookie';
axios.defaults.baseURL = "http://localhost:8080";

function HomePage(props) {
    const token = useLocation()['state']
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };
    const [calendars, setCalendars] = useState();
    const [view, setView] = useState('all');
    const [events,setEvents] = useState([
        {
            event_id: 1,
            title: "Event 1",
            start: new Date("2022/12/2 09:30"),
            end: new Date("2022/12/2 10:30"),
        }
    ]);
    const [eventsTest,setEventsTest] = useState([
        {
            event_id: 1,
            title: "Event 1",
            start: new Date("2022/12/2 09:30"),
            end: new Date("2022/12/2 10:30"),
        }
    ]);

    const newEvent = {
        'title': "task111",
        'description': "test task 111",
        'calendar': 0,
        'start_time': '2022-12-10 11:30:00+00:00',
        'end_time': '2022-12-10 13:30:00+00:00',
    }
    // axios.get('api/scheduler/calendars/tasks/?calendar=' + view,{headers:headers})
    //     .then(res =>(
    //         setEventsTest(res.data);
    //         console.log(res.data);).
    //     catch(err){{
    //         console.log('Failed api/scheduler/calendars/'); 
    //     }};
    // }

    React.useEffect(() => {
        const getCalendarsAsync = async ()=>{
            try{
                const res = await axios.get('api/scheduler/calendars/',{headers:headers})
                await setCalendars(res.data);
            }
            catch(err){{
                console.log('Failed  api/scheduler/calendars/'); 
            }};
        }
        const getEventsAsync = async ()=>{
            try{
                const res = await axios.get('api/scheduler/calendars/tasks/?calendar=' + view,{headers:headers})
                setEventsTest(res.data);
                console.log(res.data);
            }
            catch(err){{
                console.log('Failed api/scheduler/calendars/'); 
            }};
        }
        getCalendarsAsync();
        getEventsAsync();
    }, [])

    return (
        <>
            {/* <Sidebar calendars = {calendars}/> */}
            <Sidebar calendars = {calendars}/>
            <Calendar events = {events}/>
            <PopUp/>
        </>
    );
};

export default HomePage;