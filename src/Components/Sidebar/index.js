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



export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export default class index extends Component {


    state = { drawerOpen: false }


    toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({ drawerOpen: open });

        PubSub.publish('drawerOpen', { drawerOpen: open })
    };


    calendarSelected = (id) => {

    }

    addNewCalendar = () => {
        
    }


    render() {
        console.log(this.props)
        const { drawerOpen } = this.state
        const { calendarNames } = this.props
        return (
            <>``

                <CssBaseline />

                <AppBar position="fixed" open={this.state['drawerOpen']}>

                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.toggleDrawer(true)}
                            edge="start"
                            sx={{ mr: 2, ...(this.drawerOpen && { display: 'none' }) }}
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
                        width: this.drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: this.drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    open={this.state['drawerOpen']}
                    variant='persistent'
                    anchor="left"
                >
                    <DrawerHeader>
                        <IconButton onClick={this.toggleDrawer(false)}>
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
                                <ListItemButton onClick={this.calendarSelected}>
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
                            <ListItemButton onClick={this.addNewCalendar}>
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
}
