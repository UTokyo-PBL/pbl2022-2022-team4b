import React, { Component, useState, setState } from 'react'
import { styled, useTheme } from '@mui/material/styles';
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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PubSub from 'pubsub-js'
import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';



export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


function Sidebar(props) {


    // state = { drawerOpen: false }

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const {calendarNames} = props

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerOpen(open);

        PubSub.publish('drawerOpen', drawerOpen)
    };


    const calendarSelected = (id) => {

    }

    const addNewCalendar = () => {
        PubSub.publish('dialogOpen', true)
    }


    const drawerWidth = 240

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
                    {['1', '2', '3', '4'].map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
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
                    {calendarNames.map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={calendarSelected}>
                                <ListItemIcon>
                                    <CalendarMonthIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>


                <List style={{ marginTop: `auto` }}>

                    <ListItem disablePadding>
                        <ListItemButton onClick={addNewCalendar}>
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Add new calendar'} />
                        </ListItemButton>
                    </ListItem>

                </List>



            </Drawer>





        </>
    )

}

export default Sidebar
