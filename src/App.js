import React from 'react'
import Box from '@mui/material/Box';
import {useRoutes } from 'react-router-dom';
import routes from './routes'

function App() {

  const routeTable = useRoutes(routes)
  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        {routeTable}
      </Box>
    </div>
  )

}

export default App