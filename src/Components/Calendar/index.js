import React,{useState,useEffect} from 'react'
import ja from 'date-fns/locale/ja'
import PubSub from 'pubsub-js'
import { styled } from '@mui/material/styles';
import { Scheduler } from "@aldabil/react-scheduler";
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080";

// const DrawerHeader = styled('div')(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     padding: theme.spacing(0, 1),
//     ...theme.mixins.toolbar,
//     justifyContent: 'flex-end',
// }));
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
    var events = [];
    const colors = ['CornflowerBlue','Coral','LightCoral','HotPink','Thistle','Grey','MediumAquaMarine','DarkOrange'];
    const [drawerOpen, setDrawerOpen] = useState(false);
    if(props.events.length !== 0){
        events = props.events.map((item)=>{
            return {
                event_id: item["id"] + " " + item["calendar"],
                title: item["title"],
                start: new Date(item["start_time"]),
                end: new Date(item["end_time"]),
                color: colors[item["calendar"] % 8]
                // disabled: false;
                // editable: true,
                // deletable: true,
                // draggable: true,
                // allDay: false;
            }
        });
    }
    useEffect(() => {
        PubSub.subscribe('drawerOpen', (_, data) => {setDrawerOpen(data)})
    }, [])
    
    const handleDelete = (deletedId)=>{
        props.delTask(deletedId);
    };

    const handleConfirm = (event,action)=>{
        if(action === 'create'){
            props.addTask(event);
        }
        // action == 'edit
        else{
            props.editTask(event);
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
                onEventDrop= {props.dropTask}
            />
        </Main>
    )

}

export default Calendar