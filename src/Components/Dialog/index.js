import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const Index = () => {

    const [open, setOpen] = React.useState(true);

    const handleClose = () => { }

    React.useEffect(() => {
        PubSub.subscribe('dialogOpen', (_, data) => {
            setDrawerOpen(data)
        })
    }, [])


    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Set backup account</DialogTitle>

            </Dialog>
        </>
    );
}

export default Index;
