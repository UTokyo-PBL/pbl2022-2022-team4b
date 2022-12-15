
import React, { Component, useState } from 'react'
import { styled } from '@mui/material/styles';
import { Scheduler } from "@aldabil/react-scheduler";
import ja from 'date-fns/locale/ja'
import Toolbar from '@mui/material/Toolbar';

import PubSub from 'pubsub-js'
import Sidebar from '../Sidebar';
import { useLocation } from 'react-router-dom';
// import DrawerHeader from './Components/Sidebar/'

import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";


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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const drawerWidth = 240;

// data = {calendarNames:["calendar1", "calendar2"], scheules:{}}

function Calendar(props) {

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [schedules, setSchedules] = React.useState([]);

    React.useEffect(() => {
        PubSub.subscribe('drawerOpen', (_, data) => {
            setDrawerOpen(data)
        })
    }, [])

    return (
        <Main open={drawerOpen}>
            <Toolbar />
            <Scheduler
                locale={ja}
                view="month"
                events = {props.events}
            />
        </Main>
    )

}

export default Calendar