import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Calendar from '../Calendar';
import AddCalendar from '../Dialog/AddCalendar/AddCalendar';
import EditCalendar from '../Dialog/EditCalendar/EditCalendar';
import FindSlot from '../Dialog/FindSlot/FindSlot';
import DelCalendar from '../Dialog/DelCalendar/DelCalendar';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import PubSub from 'pubsub-js'
import Cookies from 'js-cookie';
import JoinCalendar from '../Dialog/JoinCalendar/JoinCalendar';
axios.defaults.baseURL = "http://localhost:8080";

// A little bug,view在里面又问题
var view = 'all';
function HomePage(props) {
    const token = useLocation()['state']
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };
    const [inviteCode,setInviteCode] = useState('');
    const [calendars, setCalendars] = useState([]);
    const [events, setEvents] = useState([]);
    const getInviteCode = async (id)=>{
        try {
            const res = await axios.get('api/scheduler/invitecode/' + id + '/',{headers: headers});
            setInviteCode(res.data['invite_code']);
            console.log(res.data);
            await PubSub.publish('inviteCode',inviteCode);
        }
        catch (err) {
            console.log('Failed  api/scheduler/invitecode/{id}');
        };
    }
    const getCalendarsAsync = async () => {
        try {
            const res = await axios.get('api/scheduler/calendars/', { headers: headers });
            await setCalendars(res.data);
            await mySetView('all');
        }
        catch (err) {
            console.log('Failed  api/scheduler/calendars/');
        };
    }
    const getEventsAsync = async (id) => {
        try {
            const res = await axios.get('api/scheduler/tasks/?calendar=' + id, { headers: headers });
            await setEvents(res.data);
        }
        catch (err) {
            console.log('Failed api/scheduler/tasks/?calendar=');
        };
    }
    const mySetView = async (id) => {
        view = id;
        if(id != 'all'){ 
            await getInviteCode(id);
        }
        await getEventsAsync(id);
    }
    const getUserInfo = async ()=>{
        try {
            const res = await axios.get('api/account/user/',{headers: headers});
            await PubSub.publish('userInfo',res.data);
            await PubSub.publish('token', token)
        }
        catch (err) {
            console.log('Failed  api/account/user/');
        };
    }

    useEffect(() => {
        getCalendarsAsync();
        getUserInfo();
    }, [])
    const addTask = (event) => {
        axios.post('api/scheduler/tasks/', {
            'title': event['title'],
            'description': '',
            'calendar': view,
            'start_time': event['start'],
            'end_time': event['end']
        },
            {
                headers: headers
            }).then(res => {
                getEventsAsync(view);
            }).catch(err => {
                console.log('Failed api/scheduler/calendars/');
            });
        console.log('create')
    }

    const delTask = (id) => {
        const [taskId, calendarId] = id.split(' ');
        axios.delete('api/scheduler/tasks/' + taskId + '/?calendar=' + calendarId,
            { headers: headers })
            .then(res => {
                getEventsAsync(view);
            }).catch(err => {
                console.log('Failed api/scheduler/tasks/{task_id}/?calendar={calendar_id}');
            });
    }

    const editTask = (event) => {
        const [taskId, calendarId] = event['event_id'].split(' ');
        axios.put('api/scheduler/tasks/' + taskId + '/?calendar=' + calendarId, {
            'title': event['title'],
            'description': '',
            'calendar': calendarId,
            'start_time': event['start'],
            'end_time': event['end']
        }, { headers: headers })
            .then(res => {
                getEventsAsync(view);
            }).catch(err => {
                console.log('Failed api/scheduler/tasks/{task_id}/?calendar={calendar_id}');
            });
    }
    const dropTask = (droppedOn, updatedEvent) => {
        const [taskId, calendarId] = updatedEvent['event_id'].split(' ');
        axios.put('api/scheduler/tasks/' + taskId + '/?calendar=' + calendarId, {
            'title': updatedEvent['title'],
            'description': '',
            'calendar': calendarId,
            'start_time': droppedOn,
            'end_time': updatedEvent['end']
        }, { headers: headers })
            .then(res => {
                getEventsAsync(view);
            }).catch(err => {
                console.log('Failed api/scheduler/tasks/{task_id}/?calendar={calendar_id}');
            });
    }

    const delCalendar = (id) => {
        axios.delete('api/scheduler/calendars/' + id + '/',
            { headers: headers })
            .then(res => {
                if (id == view) mySetView('all');
                getCalendarsAsync();
            }).catch(err => {
                console.log('Failed /api/scheduler/calendars/{calendarId}');
            });
    }

    return (
        <>
            <Sidebar calendars={calendars} mySetView={mySetView}  />
            <Calendar events={events} addTask={addTask} delTask={delTask} editTask={editTask} dropTask={dropTask}/>
            <AddCalendar getCalendarsAsync={getCalendarsAsync}></AddCalendar>
            <FindSlot ></FindSlot>
            <DelCalendar delCalendar={delCalendar}></DelCalendar>
            <JoinCalendar getCalendarsAsync={getCalendarsAsync}></JoinCalendar>
            <EditCalendar getCalendarsAsync={getCalendarsAsync}></EditCalendar>
        </>
    );
};
export default HomePage;