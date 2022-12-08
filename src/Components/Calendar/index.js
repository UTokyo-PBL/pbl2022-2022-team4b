
import React, { Component, useState } from 'react'
import { styled } from '@mui/material/styles';
import { Scheduler } from "@aldabil/react-scheduler";
import ja from 'date-fns/locale/ja'
import Toolbar from '@mui/material/Toolbar';

import PubSub from 'pubsub-js'
import Sidebar from '../Sidebar';
// import DrawerHeader from './Components/Sidebar/'

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => {
        console.log(open, 123)

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
    const [scheules, setSchedules] = React.useState([]);


    React.useEffect(() => {
        PubSub.subscribe('drawerOpen', (_, data) => {
            setDrawerOpen(data)
        })
        PubSub.subscribe('scheules', (_, data) => {
            setSchedules(data)
        })
    }, [])


    return (

        <Main open={drawerOpen}>


            <Toolbar />
            <Scheduler
                locale={ja}
                view="month"
                events={[
                    {
                        event_id: 1,
                        title: "Event 1",
                        start: new Date("2022/5/2 09:30"),
                        end: new Date("2022/5/2 10:30"),
                    },
                    {
                        event_id: 2,
                        title: "Event 2",
                        start: new Date("2022/5/4 10:00"),
                        end: new Date("2022/5/4 11:00"),
                    },
                ]}
            />

        </Main>
    )

}

export default Calendar