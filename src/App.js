
import React, { Component } from 'react'
import Sidebar from "./Components/Sidebar"
import Calendar from "./Components/Calendar"
import Box from '@mui/material/Box';

export default class App extends Component {

  state = {calendarNames:["calendar1", "calendar2"], scheules:{}}

  render() {

    const {calendarNames, scheules} = this.state

    return (

      <div className="App">
        <Box sx={{ display: 'flex' }}>

          <Sidebar calendarNames={calendarNames}/>

          <Calendar scheules={scheules}/>


        </Box>
      </div>
    )
  }
}

