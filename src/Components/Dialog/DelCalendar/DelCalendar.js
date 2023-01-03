import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js'
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';

const DelCalendar = (props) => {
    const [open, setOpen] = useState(false);
    const [inviteCode,setInviteCode] = useState('');
    const [calendarInfo, setCalendarInfo] = useState({ id: 'all', title: 'all', description: 'all calendars', owner: '', members: [], guests: [] });
    const handleClose = () => { setOpen(false) }
    const theme = createTheme();
    
    useEffect(() => {
        PubSub.subscribe('delCalendarDialog', (_, data) => { setOpen(data) });
        PubSub.subscribe('inviteCode', (_, data) => {setInviteCode(data) });
        PubSub.subscribe('selectedCalendarInfo', (_, data) => {setCalendarInfo(data)});
    }, [])

    const handleDel = (event) => {
        event.preventDefault();
        props.delCalendar(calendarInfo['id']);
        handleClose();
    };
    const handleEdit = (event) => {
        event.preventDefault();
        handleClose();
        PubSub.publish('editCalendarDialog', true);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Typography sx={{ mb: 1, height: '40px', paddingTop: '15px', textAlign: 'center', fontSize: '20px' }} variant="h6" component="div">{calendarInfo['title']}</Typography>
                    <Typography sx={{ height: '16px', textAlign: 'center', fontSize: '12px' }} variant="h6" component="div">Description:{calendarInfo['description']}</Typography>
                    <Typography sx={{ height: '16px', textAlign: 'center', fontSize: '12px' }} variant="h6" component="div">ID:{calendarInfo['id']}</Typography>
                    <List>
                        {calendarInfo['owner'] &&
                            <ListItem key={calendarInfo['owner']} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ManageAccountsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={calendarInfo['owner']} />
                                </ListItemButton>
                            </ListItem>}
                    </List>
                    {calendarInfo['members'].length !== 0 && <Divider />}
                    {calendarInfo['members'].length !== 0 && calendarInfo['members'].map((text) => (
                        <List>
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        </List>))}
                    {calendarInfo['guests'].length !== 0 && <Divider />}
                    {calendarInfo['guests'].length !== 0 && calendarInfo['guests'].map((text) => (
                        <List>
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <RemoveRedEyeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        </List>))}
                    <Divider />
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <VpnKeyIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={inviteCode} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    <Divider />
                    <Stack direction="row">
                        <Button
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ml: 3, mr: 1 }}
                            onClick={handleDel}>
                            Delete
                        </Button>
                        <Button
                            startIcon={<EditIcon />}
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ml: 2 }}
                            onClick={handleEdit}>
                            Edit
                        </Button>
                    </Stack>
                </Container>
            </ThemeProvider>
        </Dialog>
    );
};

export default DelCalendar;