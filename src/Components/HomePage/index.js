import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Calendar from '../Calendar';
import PopUp from '../PopUp'
import { useLocation  } from "react-router-dom";
import axios from 'axios'
import Cookies from 'js-cookie';
axios.defaults.baseURL = "http://localhost:8080";

// A little bug,view在里面又问题
var view = 'all';
function HomePage(props) {
    const token = useLocation()['state']
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };
    const [calendars, setCalendars] = useState([]);
    const [events,setEvents] = useState([]);
    const getCalendarsAsync = async ()=>{
        try{
            const res = await axios.get('api/scheduler/calendars/',{headers:headers});
            await setCalendars(res.data);
        }
        catch(err){{
            console.log('Failed  api/scheduler/calendars/'); 
        }};
    }
    const getEventsAsync = async (id)=>{
        try{
            const res = await axios.get('api/scheduler/tasks/?calendar=' + id,{headers:headers});
            await setEvents(res.data);
        }
        catch(err){{
            console.log('Failed api/scheduler/tasks/?calendar='); 
        }};
    } 
    const mySetView= async (id) => {
        view = id;
        await getEventsAsync(id);
    }

    React.useEffect(() => {
        getCalendarsAsync();
    }, [])

    const addTask = (event)=>{
        axios.post('api/scheduler/tasks/',{
            'title': event['title'],
            'description': '',
            'calendar': view,
            'start_time': event['start'],
            'end_time': event['end']
            },
            {headers:headers})
            .then(res =>{
                getEventsAsync(view);
            }).
            catch(err =>{
                console.log('Failed api/scheduler/calendars/'); 
            });
            console.log('create')
    }

    const delTask = (id)=>{
        const [taskId,calendarId] = id.split(' ')
        axios.delete('api/scheduler/tasks/'+ taskId +'/?calendar=' + calendarId,
            {headers:headers})
            .then(res =>{
                getEventsAsync(view);
            }).
            catch(err =>{
                console.log('Failed api/scheduler/tasks/{task_id}/?calendar={calendar_id}'); 
            });
            console.log('create')
    }

    return (
        <>
            <Sidebar calendars = {calendars} mySetView={mySetView}/>
            <Calendar events = {events} addTask = {addTask} delTask={delTask} />
            <PopUp getCalendarsAsync = {getCalendarsAsync}/>
        </>
    );
};

export default HomePage;