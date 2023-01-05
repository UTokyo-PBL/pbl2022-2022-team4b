import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import PubSub from 'pubsub-js'
import { useNavigate } from 'react-router-dom';

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Sidebar(props) {
    const colors = ['CornflowerBlue', 'Coral', 'LightCoral', 'HotPink', 'Thistle', 'Grey', 'MediumAquaMarine', 'DarkOrange'];
    const [selectedCalendarInfo, setSelectedCalendarInfo] = useState({ id: 'all', title: 'all', description: 'all calendars', owner: '', members: [], guests: [] });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [token, setToken] = useState('')
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) { return; }
        setDrawerOpen(open);
        PubSub.publish('drawerOpen', drawerOpen);
    };
    const joinCalendar = () => { PubSub.publish('joinCalendarDialog', true); }
    const calendarShow = () => {if(selectedCalendarInfo['id'] !== 'all'){PubSub.publish('delCalendarDialog', true); }}
    const addNewCalendar = () => { PubSub.publish('newCalendarDialog', true); }
    const findSlot = () => {
        if(selectedCalendarInfo['id'] !== 'all'){
            PubSub.publish('selectedCalendarInfo', selectedCalendarInfo);
            PubSub.publish('findSlotDialog', true);
        }
    }
    
    const calendarSelected = (item) => {
        setSelectedCalendarInfo(item);
        PubSub.publish('selectedCalendarInfo', selectedCalendarInfo);
        props.mySetView(item['id']);
    }
    const navigate = useNavigate()
    const drawerWidth = 240;

    useEffect(() => {PubSub.subscribe('token', (_, data) => { setToken(data) })}, [])

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" open={drawerOpen}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer(true)}
                        edge="start"
                        sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div">
                        Calendar
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                open={drawerOpen}
                variant='persistent'
                anchor="left"
            >
                <DrawerHeader>
                    <IconButton onClick={toggleDrawer(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>

                <Divider />
                <List>
                    {['Notes'].map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => navigate('/settings/account', {
                                state: token
                            })}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton selected={selectedCalendarInfo['id'] === 'all'}
                            onClick={() => calendarSelected({ id: 'all', title: 'all', description: 'all calendars', owner: '', members: [], guests: [] })}>
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary={'All'} />
                        </ListItemButton>
                    </ListItem>
                    {props.calendars && props.calendars.map((item) => {
                        const color = colors[item['id'] % 8];
                        return (
                            <ListItem key={item['id']} disablePadding>
                                <ListItemButton selected={selectedCalendarInfo['id'] === item['id']}
                                    onClick={() => calendarSelected(item)}
                                    onDoubleClick={() => calendarShow()}>
                                    <ListItemIcon>
                                        <CalendarMonthIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item['title']} />
                                </ListItemButton>
                                <Avatar sx={{ bgcolor: color, width: '8px', height: '50px', opacity: 0.25 }} variant="square"> </Avatar>
                            </ListItem>)
                    })}
                </List>
                <List style={{ marginTop: `auto` }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={findSlot}>
                            <ListItemIcon><SearchIcon /></ListItemIcon>
                            <ListItemText primary={'Find a slot'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={joinCalendar}>
                            <ListItemIcon><GroupAddIcon /></ListItemIcon>
                            <ListItemText primary={'Join calendar'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={addNewCalendar}>
                            <ListItemIcon><AddIcon /></ListItemIcon>
                            <ListItemText primary={'Creat calendar'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    )
}
export default Sidebar