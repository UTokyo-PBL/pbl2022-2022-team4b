import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Cookies from 'js-cookie';
import axios from 'axios'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

export default function Account() {

    const [userInfo, setUserInfo] = useState({})
    const [isChanging, setIsChanging] = useState({ 'name': false, 'email:': false, 'password':false })

    const token = useLocation()['state']

    console.log(token)

    const headers = {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token ' + token,
    };

    const getUserInfo = async () => {
        try {
            const res = await axios.get('http://34.146.199.221/api/account/user/', { headers: headers });
            setUserInfo(res.data)
            console.log(res.data)
        }
        catch (err) {
            console.log('Failed  api/account/user/');
        };
    }


    useEffect(() => {
        getUserInfo();
    }, [])

    const changeInfo = (infoType) => {
        setIsChanging({ ...isChanging, [infoType]: !isChanging[infoType] })
        if (isChanging(infoType)) {
            //post 
        }
    }

    return (


        <Box sx={{ width: '800%', maxWidth: 1000 }}>

            <Typography variant="h6" gutterBottom>
                Your Account
            </Typography>
            <br />
            <Divider />
            <br />
            <Typography variant="h7" fontWeight='bold'>
                User Name<br /><br />
            </Typography>
            <Grid container justifyContent="space-between">
                <Typography variant="h7">

                    {isChanging['name'] ?
                        <FormControl sx={{ width: '25ch' }}>
                            <OutlinedInput sx={{ height: '5ch' }} placeholder={userInfo['name']} />
                        </FormControl> : userInfo['name']}



                </Typography>
                <Button variant="outlined" onClick={() => { changeInfo('name', this) }} sx={{ height: '5ch' }}>
                    {isChanging['name'] ? 'save' : 'change'}
                </Button>
            </Grid>

            <br />
            <Divider />
            <br />

            <Typography variant="h7" fontWeight='bold'>
                Mail Address<br /><br />
            </Typography>
            <Grid container justifyContent="space-between">
                <Typography variant="h7">

                    {isChanging['email'] ?
                        <FormControl sx={{ width: '25ch' }}>
                            <OutlinedInput sx={{ height: '5ch' }} placeholder={userInfo['email']} />
                        </FormControl> : userInfo['email']}

                </Typography>
                <Button variant="outlined" onClick={() => { changeInfo('email', this) }} sx={{ height: '5ch' }}>
                    {isChanging['email'] ? 'save' : 'change'}
                </Button>
            </Grid>

            <br />
            <Divider />
            <br />
            
            <Typography variant="h7" fontWeight='bold'>
                Password<br /><br />
            </Typography>
            <Grid container justifyContent="space-between">
                <Typography variant="h7">

                    {isChanging['password'] ?
                        <FormControl sx={{ width: '25ch' }}>
                            <OutlinedInput sx={{ height: '5ch' }} />
                        </FormControl> : '**********'}

                </Typography>
                <Button variant="outlined" onClick={() => { changeInfo('password', this) }} sx={{ height: '5ch' }}>
                    {isChanging['password'] ? 'save' : 'change'}
                </Button>
            </Grid>
           

        </Box>

    );


}