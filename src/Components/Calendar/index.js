import React, { Component, useState } from 'react'
import { styled } from '@mui/material/styles';
import { Scheduler } from "@aldabil/react-scheduler";
import ja from 'date-fns/locale/ja'
import Toolbar from '@mui/material/Toolbar';
import PubSub from 'pubsub-js'
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));
const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => {
        return ({
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${0}px`,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: `${-drawerWidth}px`,
            }),
        })

    },
);

function Calendar(props) {
    const token = useLocation()['state']
    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };
    var events = [];
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    if(props.events.length != 0){
        events = props.events.map((item)=>{
            return {
                event_id: item["id"] + " " + item["calendar"],
                title: item["title"],
                start: new Date(item["start_time"]),
                end: new Date(item["end_time"]),
                // color: ;
                // disabled: false;
                // editable: true,
                // deletable: true,
                // draggable: true,
                // allDay: false;
            }
        });
    }
    React.useEffect(() => {
        PubSub.subscribe('drawerOpen', (_, data) => {
            setDrawerOpen(data)
        })
    }, [])
    
    const handleDelete = (deletedId)=>{
        props.delTask(deletedId);
    };

    const handleConfirm = (event,action)=>{
        if(action == 'create'){
            props.addTask(event);
        }
        // action == 'edit
        else{
            console.log('edit')
        }
        return event;
    };

    return (
        <Main open={drawerOpen}>
            <Toolbar />
            <Scheduler
                locale={ja}
                view="month"
                events = {events}
                onConfirm = {handleConfirm}
                onDelete={handleDelete}
            />
        </Main>
    )

}

export default Calendar