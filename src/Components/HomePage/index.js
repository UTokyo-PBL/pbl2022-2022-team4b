import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Calendar from '../Calendar';


function HomePage(props) {

    const [Token, setToken] = React.useState({})

    const [userInfo, setUserInfo] = React.useState({ calendarNames: ["calendar1", "calendar2"], scheules: {} })

    React.useEffect(() => {
        //用axios向服务器发送token获取用户信息
        //setUserInfo
    }, [])

    const {calendarNames, scheules} = userInfo

    return (
        <>
            <Sidebar calendarNames={calendarNames}/>
            <Calendar scheules = {scheules}/>
        </>
    );
};

export default HomePage;