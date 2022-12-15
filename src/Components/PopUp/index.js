import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PubSub from 'pubsub-js'
import AddNewCalendar from '../AddNewCalendar/AddNewCalendar'
function PopUp(props) {

    const [open, setOpen] = React.useState(false);

    const handleClose = () => { 
        setOpen(false)
    }

    React.useEffect(() => {
        PubSub.subscribe('dialogOpen', (_, data) => {
            setOpen(data)
        })
    }, [])


    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                {/* <DialogTitle>New calendar name: </DialogTitle> */}
                <AddNewCalendar getCalendarsAsync = {props.getCalendarsAsync}></AddNewCalendar>
            </Dialog>
        </>
    );
}

export default PopUp;
