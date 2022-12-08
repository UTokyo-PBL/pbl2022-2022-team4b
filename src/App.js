import React, { Component, useState, setState } from 'react'
import Sidebar from "./Components/Sidebar"
import Calendar from "./Components/Calendar"
import Box from '@mui/material/Box';
import { Routes, Route, useRoutes } from 'react-router-dom';
import routes from './routes'

function App() {

  const routeTable = useRoutes(routes)

  

  return (

    <div className="App">
      <Box sx={{ display: 'flex' }}>

        {/* <Sidebar calendarNames={calendarNames} />

        <Calendar scheules={scheules} /> */}

        {routeTable}


      </Box>
    </div>
  )

}

export default App