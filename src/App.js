
import React, { Component } from 'react'
import Sidebar from "./Components/Sidebar"
import Calendar from "./Components/Calendar"
import Box from '@mui/material/Box';
import { Routes, Route } from 'react-router-dom';

function App() {



  [state, setState] = useState({ calendarNames: ["calendar1", "calendar2"], scheules: {} })


  const { calendarNames, scheules } = state

  return (

    <div className="App">
      <Box sx={{ display: 'flex' }}>

        <Sidebar calendarNames={calendarNames} />

        <Calendar scheules={scheules} />


      </Box>
    </div>
  )

}

export default App